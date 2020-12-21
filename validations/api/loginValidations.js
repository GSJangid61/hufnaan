const Joi = require("joi");
const helper = require('../../helpers/helper');

const LoginValidation = (body) => {
  const Schema = {
    email: Joi.string().email().required(),
    password: Joi.required(),
  };
  let error = false;
  let message = '';
  let validate = Joi.validate(body, Schema);
  if(validate.error){
    message= validate.error.details[0].message;
    message = helper.capitalize(message.replace(/"/g, ''));
    console.log(message);
    error = true;
  }
  return {error: error, message: message};
};

exports.LoginValidation = LoginValidation;