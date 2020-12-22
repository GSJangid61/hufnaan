
const Constants = require("../helpers/constants");
const mongoose = require("mongoose");
const model = require("../lib/model");
const AWS = require("aws-sdk");

const crypto = require('crypto'); 
const {User} = require('../model/user');

const createCipheriv = crypto.createCipheriv;
const scrypt = crypto.scrypt;
const timingSafeEqual = crypto.timingSafeEqual;


const hashPassword = async function (password, salt) {
    return new Promise((resolve, reject) => {
        const bSalt = Buffer.concat([
            Buffer.from(salt, 'base64'),
            Buffer.from(process.env.SALT_SEPERATOR, 'base64'),
          ])

        const iv = Buffer.alloc(Constants.IV_LENGTH, 0)

        scrypt(password, bSalt, Constants.KEYLEN, {
            N: 2 ** Constants.MEM_COST,
            r: Constants.ROUNDS,
            p: 1,
          }, (err, derivedKey) => {
            if (err) {
              return reject(err)
            }
            try {
              const cipher = createCipheriv(Constants.ALGORITHM, derivedKey, iv)
              resolve(Buffer.concat([ cipher.update(Buffer.from(process.env.KEY, 'base64')), cipher.final() ]).toString('base64'))
            } catch (error) {
              
              reject(error)
            }
          })
    })
}


const verifyPassword = async function (password, salt, passwordHash) {
    const generatedHash = await hashPassword(password, salt)

    const knownHash = Buffer.from(passwordHash, 'base64')
    const bGeneratedHash = Buffer.from(generatedHash, 'base64')

    if (bGeneratedHash.length !== knownHash.length) {
        // timingSafeEqual throws when buffer lengths don't match
        timingSafeEqual(knownHash, knownHash)
        return false
    }
    return timingSafeEqual(bGeneratedHash, knownHash)
}


const capitalize = function(string) {
    return string && string[0].toUpperCase() + string.slice(1);
};

const ucFirst = function (str) {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1);
    }).replace(/\s/g, "");
}

const getUser = async function(_id) {
	var query = { _id: _id };
	let user = JSON.parse(JSON.stringify(await model.findOne(User, query, {})));
	return user;
};

async function verifyUser(email) {
    var query = { "email": email, "status": 1};
    var projection = 'email status _id salt password';
  
    let userData = await model.findOne(User, query, projection);
    return userData;
  }


module.exports = {
	hashPassword,
    verifyPassword,
    capitalize,
    ucFirst,
    getUser,
    verifyUser
};
