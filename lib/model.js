const mongoose = require("mongoose");
const find = async function(collectionObj, query, projection){
    return new Promise(async (resolve, reject) => {
      try {
        let queryResponse = collectionObj.find(query).select(projection);
        resolve(queryResponse);
      } catch (error) {
        Sentry.captureException(error);
        reject(error)
      }
  });
}

const findOne = async function (collectionObj, query, projection) {
    return new Promise(async (resolve, reject) => {
        try {
          let queryResponse = collectionObj.findOne(query).select(projection);

          resolve(queryResponse);
        } catch (error) {
          Sentry.captureException(error);
          reject(error)
        }
    });
}

const remove = async function(collectionObj, query){
    return new Promise(async (resolve, reject) => {
      try {
        let queryResponse = collectionObj.findOneAndRemove(query);
        resolve(queryResponse);
      } catch (error) {
        Sentry.captureException(error);
        reject(error)
      }
  });
}

const findWithPaging = async function (collectionObj, query, projection, limit, skip, sort) {
  return new Promise(async (resolve, reject) => {
      try {
        let queryResponse = collectionObj.find(query)
						   .select(projection)
					   	   .limit(limit)
				   	   	   .skip(skip)
				   	   	   .sort(sort);
        resolve(queryResponse);
      } catch (error) {
        Sentry.captureException(error);
        reject(error)
      }
  });
}

const lookupWithPaging = async function(collectionObj, query, projection, limit, skip, sort, from, localField, foreignField) {
  return new Promise(async (resolve, reject) => {
      try {
        let queryResponse = collectionObj.aggregate([
          {
            $match : query
          },
          {
            $sort : sort
          },
          
          {
            $skip : skip
          },
          {
            $limit : limit
          },
          {
            $lookup : {
              from : from,
              localField : localField,
              foreignField : foreignField,
              as : 'refData'
            }
          },
          {
            $project : projection
          }
        ]);

        resolve(queryResponse);
      } catch (error) {
        Sentry.captureException(error);
        reject(error)
      }
  });
}

const count = async function(collectionObj, query) {
    return new Promise (async (resolve, reject) => {
      try{
        let response = await collectionObj.countDocuments(query);
        resolve(response);
      }catch(error){
        Sentry.captureException(error);
        reject(error);
      }
    });
  }
  
  module.exports = {
    find,
    findOne,
    findWithPaging,
    lookupWithPaging,
    count,
    remove
    
  };