
import express from 'express';
import { login, logout, signup } from '../controllers/authcontrollers.js';


const router = express.Router();

router.post('/signup', signup);// checked
   

router.post('/login',login );// checked
  
 
router.post('/logout',logout);// checked
 








export default router;
