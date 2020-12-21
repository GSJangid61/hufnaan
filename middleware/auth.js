
const { Admin } = require('../model/user');
const model = require('../lib/model');
const jwt = require('jsonwebtoken');
const messages = require('../helpers/messages');
const responseHandler = require('../helpers/responseHandler');
const helper = require('../helpers/helper');
const { adminLoginValidation } = require('../../../validations/admin/auth/loginValidation');
const { adminLogoutValidation } = require('../../../validations/admin/auth/logoutValidation');
const async = require('async');

require('dotenv').config();

const loginAdmin = async (req, res) => {
	try {
		let validation = adminLoginValidation(req.body);
		if (validation && validation.error == true) {
			return responseHandler(res, true, validation.message, [], 422);
		}

		let { email } = req.body;
		email = email.toLowerCase();

		let admin = await helper.verifyAdmin(email);

		if (!admin) {
			return responseHandler(res, true, messages.adminNotFound, [], 404);
		}
		else {
			const convertedPassword = await helper.hashPassword(req.body.password, admin.salt);

			if (convertedPassword != admin.password) {
				return responseHandler(res, true, messages.invalidPassword, [], 401);
			}
			else {
				jwt.sign({ email: email }, process.env.JWT_KEY, { expiresIn: '48h' }, async (err, token) => {
					if (err) {
						Sentry.captureMessage("Token for forgot password is invalid " + JSON.stringify(err), 'error');
						return responseHandler(res, true, messages.somethingWentWrong, [], 500);
					}else{
						const adminDetail = await helper.getAdmin(admin._id);

						adminDetail['token'] = token;

						try{
							let response = await model.findAndModify(Admin, {'email' : email , 'type':1}, {'$addToSet' : {token : token}});
							
							async.eachSeries(response['data']['token'], function(item, itemCb){
								jwt.verify(item, process.env.JWT_KEY, async function (error, jwtData) {
						            if (error) {
						                Admin.findOneAndUpdate({'email' : email , 'type':1}, {'$pull' : {token : item}}, {new : true}, function (err, docRes) {
							                if(err){
							                	return itemCb();
							                }else{
							                	return itemCb();
							                }
						                });						                
						            } else {
						                return itemCb();
						            }
						        });
							}, function(err){
								return responseHandler(res, false, messages.loginSuccess, adminDetail, 200);
							});
						}catch(e){
							Sentry.captureException(e);
							return responseHandler(res, false, messages.loginFailed, [], 200);
						}
					}
				});
			}
		}
	} catch (ex) {
		Sentry.captureException(ex);
		return responseHandler(res, true, messages.somethingWentWrong, [], 500);
	}
};

const logoutAdmin = async (req, res) => {
	try {
		let validation = adminLogoutValidation(req.body);
		if (validation && validation.error == true) {
			return responseHandler(res, true, validation.message, [], 422);
		}

		let { email } = req.body;
		let token = req.header('token');

		let admin = await helper.verifyAdmin(email);

		if (!admin) {
			return responseHandler(res, true, messages.adminNotFound, [], 404);
		} else {
			try{
				await model.findAndModify(Admin, {'email' : email , 'type':1}, {'$pull' : {token : token}});
				return responseHandler(res, false, messages.logoutSuccess, [], 200);
			}catch(e){
				Sentry.captureException(e);
				return responseHandler(res, false, messages.logoutFail, [], 200);
			}
		}
	} catch (ex) {
		Sentry.captureException(ex);
		return responseHandler(res, true, messages.somethingWentWrong, [], 500);
	}
};

module.exports = {
	loginAdmin,
	logoutAdmin,
};
