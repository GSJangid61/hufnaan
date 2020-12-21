

const { User } = require('../../../model/user');
const model = require('../../../libs/model');
const jwt = require('jsonwebtoken');
const messages = require('../../../helpers/messages');
const responseHandler = require('../../../helpers/responseHandler');
const helper = require('../../../helpers/helper');
const loginValidation = require('../../../validations/api/loginValidations');
const async = require('async');

require('dotenv').config();

const login = async (req, res) => {
	try {
		let validation = loginValidation.LoginValidation(req.body);
		if (validation && validation.error == true) {
			return responseHandler(res, true, validation.message, [], 422);
		}

        const convertedPassword = await helper.hashPassword(req.body.password, admin.salt);

        if (convertedPassword != admin.password) {
            return responseHandler(res, true, messages.invalidPassword, [], 401);
        }
        else {
            jwt.sign({ email: email }, process.env.JWT_KEY, { expiresIn: '48h' }, async (err, token) => {
                if (err) {
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
    catch(ex){

    }
};



module.exports = {
	login,
};
