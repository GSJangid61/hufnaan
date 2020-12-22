
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    email: { type: String, required: true,unique:true },
    phoneNumber:{type:Number,required:false},
  	password: { type: String, required: true  },  	
  	createdAt: { type: Date },
  	updatedAt: { type: Date },
  	status: { type: Number, default:1 }, // 1 Active | 2 Inactive
  	type:{
  		type: String,
          enum : [1,2,3],  //1 for admin  2 for teacher  3 for student
          required:true,
	  } , 
	steps:{type:Number,required:true},
  	salt: { type: String, required:true }
}, {timestamps : true});

const User = mongoose.model("user", userSchema);
exports.User = User;