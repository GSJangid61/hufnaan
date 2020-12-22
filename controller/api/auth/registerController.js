
const { User } = require('../../../model/user');
const model = require('../../../lib/model');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const messages = require('../../../helpers/messages');
const constants = require('../../../helpers/constants');
const responseHandler = require('../../../helpers/responseHandler');
const helper = require('../../../helpers/helper');
const async = require('async');

require('dotenv').config();

const register = async (req, res) => {
	try {
        let { email ,type,password } = req.body;
		if (req.body.email === 'undefined' && req.body.password === 'undefined' && req.body.type === 'undefined') {
			return responseHandler(res, true, messages.allFieldsRequired, [], 422);
		}
        email = email.toLowerCase();
        
		let user = await helper.verifyUser(email);
		if (user) {
			return responseHandler(res, true, messages.userAlreadyExists, [], 404);
		}
		else {
			const salt = crypto.randomBytes(constants.ROUNDS).toString('base64');
			const  hash = await helper.hashPassword(req.body.password, salt);

            var data = {'email':email,'password':hash,'salt':salt,'type':type,'steps':1};
            
			let user = new User(data);
			try{
				newUser = await model.insertData(user);
				jwt.sign({ email: newUser.email }, process.env.JWT_KEY, { expiresIn: '24h' }, async (err, token) => {
					if (err) {
						Sentry.captureException(err);
						return responseHandler(res, true, messages.somethingWentWrong, [], 500);
					}else{
						const userDetail = await helper.getUser(newUser._id);

                        userDetail['token'] = token;
                        return responseHandler(res, false, messages.signupSuccess, userDetail, 200);	
					}
				});
			}catch(e){
				console.log(e);
				if(e.code === 11000){
					return responseHandler(res, true, messages.duplicateValue+' '+JSON.stringify(e.keyValue), [], 500);
				}else{
					return responseHandler(res, true, messages.somethingWentWrong, [], 500);
				}
			}
		}
	} catch (ex) {
        console.log(ex);
		return responseHandler(res, true, messages.somethingWentWrong, [], 500);
	}
};


const registerStep2  = async (req , res) => {

}

const registerStep3  = async (req , res) => {

}

const registerStep4  = async (req , res) => {

}

const registerStep5  = async (req , res) => {

}

const registerStep6  = async (req , res) => {

}



module.exports = {
    register,
    registerStep2,
    registerStep3,
    registerStep4,
    registerStep5,
    registerStep6
};
