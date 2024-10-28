import express from 'express';
import { followUnfollowUser, getSuggestedUsers, getUserProfile, updateUserProfile } from '../controllers/usercontrollers.js';
import { protectRoute } from '../middleware/protectroute.js';
import { bookmarkPost, removeBookmark } from '../controllers/bookmarkcontrollers.js';

const router= express.Router(); 

router.get('/profile/:username',protectRoute,getUserProfile);
router.get('/suggested',protectRoute,getSuggestedUsers);
 router.post('/follow/:id',protectRoute,followUnfollowUser);  
router.post('/update',protectRoute,updateUserProfile);
// Add bookmark routes
router.post('/bookmark', protectRoute, bookmarkPost); // Route to bookmark a post
router.delete('/bookmark', protectRoute, removeBookmark);


export default  router;    
