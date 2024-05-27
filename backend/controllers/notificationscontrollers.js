import Notification from "../models/notificationmodel.js";





export const getNotifications=async (req,res)=>{
try {
const userId=req.user._id;
const notifications=await Notification.find({to:userId})
.populate({
    path:"from",
    select:"username profileImg",
})
await Notification.updateMany({to:userId},{read:true});
res.status(200).json(notifications); 

}

    catch(err){   

        console.error('Error in delete notifications:', err.message);
        res.status(500).json({
        error:"Something went wrong in delete notifications",
        });
        
        } 
        

}



export const deleteNotifications=async (req,res)=>{

try{
const user = req.user._id;
await Notification.deleteMany({to:user});
res.status(200).json({
message:"Notifications deleted successfully",
});

}
catch(err){   

console.error('Error in delete notifications:', err.message);
res.status(500).json({
error:"Something went wrong in delete notifications",
});

}

}


export const deleteOneNotifications=async (req,res)=>{

try{
const notifiactionId = req.params.id;
const userId=req.user._id;
const notification= await Notification.findById(notifiactionId);

if(!notification){
    return res.status(404).json({
        error:"Notification not found",
    });
}

if(notification.to.toString()!==userId.toString()){
    return res.status(403).json({
        error:"You are not authorized to delete this notification",
    });

}
await Notification.findByIdAndDelete(notifiactionId);
res.status(200).json({
message:"Notification deleted successfully", 
});





}
catch(err){
console.error('Error in delete notifications:', err.message);
res.status(500).json({
error:"Something went wrong in delete notifications",
});


}

}