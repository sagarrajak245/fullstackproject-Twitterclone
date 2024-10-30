import express from 'express';
// import { bookmarkPost, getBookmarks, removeBookmark } from '../controllers/bookmarkcontrollers.js';
import { followUnfollowUser, getSuggestedUsers, getUserProfile, updateUserProfile } from '../controllers/usercontrollers.js';
import { protectRoute } from '../middleware/protectroute.js';

const router = express.Router();

router.get('/profile/:username', protectRoute, getUserProfile);
router.get('/suggested', protectRoute, getSuggestedUsers);
router.post('/follow/:id', protectRoute, followUnfollowUser);   
router.post('/update', protectRoute, updateUserProfile);

// // Add bookmark routes
// router.post('/bookmarks', protectRoute, bookmarkPost); // Route to bookmark a post
// router.delete('/bookmarks', protectRoute, removeBookmark); // Route to remove a bookmark
// router.get('/bookmarks', protectRoute, getBookmarks); // Route to get all bookmarks

export default router;
