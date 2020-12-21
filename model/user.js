const { boolean } = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true,unique:true },
    phoneNumber:{type:Number,required:true},
  	password: { type: String, required: true  },  	
  	createdAt: { type: Date },
  	updatedAt: { type: Date },
  	status: { type: boolean, default:true }, // 1 Active | 2 Inactive
  	type:{
  		type: string,
          enum : [1,2,3],  //1 for admin  2 for teacher  3 for student
          required:true,
  	} , 
  	salt: { type: String, required:true }
}, {timestamps : true});

const User = mongoose.model("user", userSchema);
exports.User = User;