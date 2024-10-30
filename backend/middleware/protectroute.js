
// protectRoute.js
import jwt from 'jsonwebtoken';
import User from '../models/usermodel.js';

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    //  console.log('Token:', token);
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No Token Provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: 'Unauthorized: Invalid Token' });
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found sagar' });
    }
 
    req.user = user;
    next();
  } catch (err) {
    console.error('Error in protectRoute middleware', err.message);
    res.status(500).json({ error: 'Internal Server Error in protectRoute' });
  }
};
