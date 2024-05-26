
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';
  

//models
import Notification from '../models/notificationmodel.js';
import User from '../models/usermodel.js';

export const  getUserProfile=async(req,res)=>{

const {username}= req.params;
try{
const  user=await User.findOne({username}).select("-password");
if(!user){//if not found throw error

    return res.status(404).json({  
        message:"User not found",
    });
}
// if present send response with user
res.status(200).json(user);

}


catch(err){
res.status(500).json({
    error:err.message
});

}

}


export const followUnfollowUser=async(req,res)=>{



try{     
    const {id}=req.params;
    const usermodify= await User.findById(id);
    const currentuser= await User.findById(req.user._id); 
if(id==req.user._id){

    return res.status(400).json({
 error:"you cant follow unfollow urself" 

    });
}

if(!usermodify || !currentuser){

    return res.status(404).json({
        error:"user not found"
    });

}
const isfollowing= currentuser.following.includes(id);

if(isfollowing){// this is logic for unfollow user
    await User.findByIdAndUpdate(id,{$pull:{followers:req.user._id}})
await User.findByIdAndUpdate(req.user._id,{$pull:{following:id}})
 res.status(200).json({
     message:"unfollowed user"
 });


}
else { // this is logic for follow user    

await User.findByIdAndUpdate(id,{$push:{followers:req.user._id}})
await User.findByIdAndUpdate(req.user._id,{$push:{following:id}})

const newnotifiaction=new Notification({  
    type:"follow",
    from:req.user._id,
    to:usermodify._id,
    read:false,
});

await newnotifiaction.save();


//send notification to usermodify
res.status(200).json({
    message:"followed user"
});
}

}


catch(err){

console.log('error in followUnfollowUser',err.message);     
res.status(500).json({
    error:err.message
});

}

}


export const getSuggestedUsers= async (req,res)=>{

try{

const userId=req.user._id;
const userFollowedByMe=await User.findById(userId).select("following");
const users =await User.aggregate([
    {$match :{_id:{$ne:userId}}},
    {$sample:{size:10}},
 
])
const filteredUsers=users.filter(user=>!userFollowedByMe.following.includes(user._id));

const  suggestedUsers=filteredUsers.slice(0,4);
suggestedUsers.forEach(user=>user.password=null);
res.status(200).json(suggestedUsers);



}

catch(err){  

console.log('error in getSuggestedUsers',err.message);
res.status(500).json({
    error:err.message
});

}


}



export const updateUserProfile=async (req,res)=>{

    const{fullname,email,username,currentPassword,newPassword,bio,link}=req.body;
    let {profileImg,coverImg}=req.body;

    const userId=req.user._id;



try{

let user=await User.findById(userId);  //find user by id
if(!user){

    return res.status(404).json({
        error:"user not found im in updateprofile"
    });
}

if((!newPassword && currentPassword)||(newPassword && !currentPassword))

{
return res.status(400).json({
    error:"Please provide both current and new password"
});
    
}
if(currentPassword && newPassword){
const ismatch=await bcrypt.compare(currentPassword,user.password);
if(!ismatch){
    return res.status(400).json({
        error:"Invalid current password"
    });
}


if(newPassword.length<6){
    return res.status(400).json({
        error:"Password must be atleast 6 characters long"
    });
}
const salt=await bcrypt.genSalt(10);
user.password=await bcrypt.hash(newPassword,salt);  
}

if(profileImg){

if(user.profileImg){// if image already exixts then delete it

await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split('.')[0]);

}

   const uploadedResponse = await cloudinary.uploader.upload(profileImg  )
profileImg=uploadedResponse.secure_url; 

}

if(coverImg){

if(user.coverImg){// if image already exixts then delete it

await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split('.')[0]);
}

    const uploadedResponse = await cloudinary.uploader.upload(coverImg  )

    coverImg=uploadedResponse.secure_url;
}

user.fullname=fullname || user.fullname;
user.email=email || user.email;
user.username=username || user.username;
user.bio=bio || user.bio;
user.link=link || user.link;
user.profileImg=profileImg || user.profileImg;
user.coverImg=coverImg || user.coverImg;

user = await user.save();

user.password=null;// not gonna update data base password but response password
res.status(200).json(user);  






}
catch(err){

console.log('error in updateUserProfile',err.message);
res.status(500).json({
    error:err.message
});

}

}