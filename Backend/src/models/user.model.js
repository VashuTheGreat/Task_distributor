const mongoose=require("mongoose");

    const userSchema=new mongoose.Schema({
        fullName:{
             type: String,
    required: true,
    trim: true

        },
     
        userName: {
    type: String,
    required: true,
    trim: true,
    unique:true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
    },{timeStamp:true})


    


const User=mongoose.model("User", userSchema);

module.exports=User;