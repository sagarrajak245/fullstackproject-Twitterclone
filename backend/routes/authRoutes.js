
import express from 'express';
import { getMe, login, logout, signup } from '../controllers/authcontrollers.js';
import { protectRoute } from '../middleware/protectroute.js';

const router = express.Router();


router.get('/me',protectRoute,getMe);// checked 

// router.get('/me',getMe);// checked


router.post('/signup', signup);// checked
   

router.post('/login',login );// checked 
  
 
router.post('/logout',logout);// checked
 








export default router;
