


import { v2 as cloudinary } from 'cloudinary';
import Notification from '../models/notificationmodel.js';
import Post from '../models/postmodel.js';
import User from '../models/usermodel.js';

export const createPost = async (req, res) => {   
  try {
    const { text } = req.body;
    let { img } = req.body;
    const userId = req.user._id.toString();

    console.log('Request body:', req.body); 
    console.log('User ID:', userId);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    if (!text && !img) {
      return res.status(400).json({
        error: 'Text or image is required',
      });
    }

    if (img) {
      console.log('Image present:', img);
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const newpost = new Post({
      user: userId,
      text,
      img,
    });

    await newpost.save();
    res.status(201).json(newpost);
  } catch (err) {
    console.error('Error in create post:', err.message);
    res.status(500).json({
      error: 'Something went wrong in create post',
    });
  }
};



export const deletePost = async (req, res) => {

try{
const post =await Post.findById(req.params.id);
if(!post){
    return res.status(404).json({
        error:"Post not found",
    });}

    if(post.user.toString()!==req.user._id.toString()){
        return res.status(401).json({
            error:"You are not authorised to  delete post",
        });
    }


    if(post.img){ //if image delete from cloudinary
        const imgId=post.img.split('/').pop().split('.')[0];
await cloudinary.uploader.destroy(imgId);

    }// if not image delete this way
await Post.findByIdAndDelete(req.params.id);
res.status(200).json({
    message:"Post deleted successfully",  
});


}

catch(err){
 console.error('Error in delete post:', err.message);
    res.status(500).json({
        error:"Something went wrong in delete post",
    });



}


}

export const Commentonpost=async (req,res)=>{

try{

const {text}=req.body;
const postId=req.params.id;
const userId=req.user._id;

if(!text){
    return res.status(400).json({
        error:"Text is required",
    });
}
//check post is present or not
const post=await Post.findById(postId);
if(!post){
    return res.status(404).json({
        error:"Post not found",
    });
}
// add comment to post
const comment={user:userId,text}
post.comments.push(comment);
await post.save();
res.status(200).json(post);
}

//update comments in cache






catch(err){
    console.error('Error in comment on post:', err.message);  
    res.status(500).json({
        error:"Something went wrong in comment on post",
    });
}

}


export const likeUnlikePost = async (req, res) => {   
  try {

    const userId = req.user._id;
    const {id: postId } = req.params;     
    

    const post = await Post.findById(postId); 
    
    // console.log(postId); debug log


    if (!post) {
      return res.status(404).json({
        error: "Post not found",
      });
    }

    const userLikedPost = post.likes.includes(userId);
    if (userLikedPost) {
      await Post.updateOne({_id:postId}, { $pull: { likes: userId } });
      await User.updateOne({_id:userId}, { $pull: { likedPosts: postId }});
      
      const updatedLikes= post.likes.filter((id)=>id.toString()!==userId.toString());
      return res.status(200).json({
      updatedLikes
      });
    } else {
     await  post.likes.push(userId);
     await User.updateOne({_id:userId}, { $push: { likedPosts: postId }});
      await post.save();

      const notification = new Notification({
        type: "like",
        from: userId, // who is causing the notification
        to: post.user, // who is receiving the notification
        read: false,
      });
      await notification.save();
const updatedLikes=post.likes;

      return res.status(200).json(
          updatedLikes
      );
    }
  } catch (err) {
    console.error('Error in like unlike post:', err.message);
    res.status(500).json({
      error: "Something went wrong in like unlike post",
    });
  }
}



export const getAllPosts=async (req,res)=>{

try{
const posts= await Post.find().sort({createdAt:-1}).populate({path:"user", 
    select:"-password",
}).populate({path:"comments.user",select:"-password"});  

if(posts.length===0){
    return res.status(404).json([]); 
}

//give all posts as response 
res.status(200).json(posts);




}
catch(err){
    console.error('Error in get all posts:', err.message);
    res.status(500).json({
        error:"Something went wrong in get all posts",
    });


}

}





export const getLikedPosts = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Log the likedPosts array
    // console.log("Liked Posts IDs:", user.likedPosts);

    // Fetch the liked posts
    const likedPosts = await Post.find({ _id: { $in: user.likedPosts } }).populate(
      {
        path: "user",
        select: "-password -email" // Exclude password and email
      }
    ).populate({
      path: "comments.user",
      select: "-password -email" // Exclude password and email
    });

    // Log the liked posts fetched  debuglog
    // console.log("Liked Posts:", likedPosts);

    res.status(200).json(likedPosts);
  } catch (err) {
    console.error('Error in get liked posts:', err.message); 
    res.status(500).json({
      error: "Something went wrong in get liked posts",
    });
  }
};


export const getfollowingPosts=async(req,res)=>{

try{
    const userId=  req.user._id;
    const user= await User.findById(userId);
if(!user){
    return res.status(404).json({
        error:"User not found",
    });}

const following=user.following;

const followingPosts=await Post.find({user:{$in:following}})
.sort({createdAt:-1})
.populate({path:"user",select:"-password"})
.populate({path:"comments.user",select:"-password"});

if(followingPosts.length===0){
    return res.status(404).json([]);
}

res.status(200).json(followingPosts);


}
catch(err){
    console.error('Error in get following posts:', err.message);
    res.status(500).json({
        error:"Something went wrong in get following posts",
    });

}


}

export const getUserPosts=async(req,res)=>{


    try{
const {username}=req.params;
        
        const user= await User.findOne({username});
        if(!user){
            return res.status(404).json({
                error:"User not found",
            });
        }

const posts= await Post.find({user:user._id})//retrive all posts of username
.sort({createdAt:-1})
.populate({path:"user",select:"-password"})
.populate({path:"comments.user",select:"-password"});
res.status(200).json(posts);

    }

catch(err){
console.log('Error in get user posts:', err.message);
res.status(500).json({
    error:"Something went wrong in get user posts",  
});


}


}