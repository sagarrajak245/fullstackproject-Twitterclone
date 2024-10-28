import express from 'express';
import { Commentonpost, createPost, deletePost, getAllPosts, getLikedPosts, getUserPosts, getfollowingPosts, likeUnlikePost } from '../controllers/postcontrollers.js';
import { protectRoute } from '../middleware/protectroute.js';





const router=express.Router(); 


router.post('/create',protectRoute,createPost);    
router.delete('/:id',protectRoute,deletePost);
router.post('/like/:id',protectRoute,likeUnlikePost);
router.post('/comment/:id',protectRoute,Commentonpost); 
router.get('/all',protectRoute,getAllPosts);   
router.get('/likes/:id',protectRoute,getLikedPosts); 
router.get('/following',protectRoute,getfollowingPosts); 
router.get('/user/:username',protectRoute,getUserPosts);







export default router;