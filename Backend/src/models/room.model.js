const mongoose=require("mongoose");

    const RoomSchema=new mongoose.Schema({
        name:{
            type:String
        },
        createdBy:{
            type:mongoose.Schema.Types.ObjectId,ref:"User",required:true
        },
        members:[
            {
                
                
                userId:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
                role:{type:String,enum:['admin','member'],default:"member"}
        
        
        }
        ],
        createdAt:{type:Date,default:Date.now}
        });


    


const Room=mongoose.model("Room", RoomSchema);

module.exports=Room;