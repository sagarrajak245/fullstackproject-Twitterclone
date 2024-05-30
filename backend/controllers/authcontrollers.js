import bcrypt from 'bcryptjs';
import { generateTokenandSetCookie } from '../lib/utils/generateToken.js';
import User from '../models/usermodel.js';


export const signup = async (req, res) => { 
    try {
        const { username, fullname, password, email } = req.body;

//debugging logs
// console.log("username",username);
// console.log("fullname",fullname);
// console.log("password",password);
// console.log("email",email);





        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Check if username is taken
        const existingUser = await User.findOne({ username });    
        if (existingUser) {
            return res.status(400).json({ message: "Username is already taken" });
        }

        // Check if email is taken
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email is already taken" });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            username,
            fullname,
            password: passwordHash,
            email,
        });

        // Save the new user
        await newUser.save();

        // Generate token and set cookie
        generateTokenandSetCookie(newUser._id, res);

        // Send response
        res.status(201).json({
            _id: newUser._id,
            username: newUser.username,
            fullname: newUser.fullname,
            email: newUser.email,
            followers: newUser.followers,
            following: newUser.following,
            profilePicture: newUser.profilePicture, 
            coverPicture: newUser.coverPicture,
            bio: newUser.bio,
            link: newUser.link,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Something went wrong in signup", 
        }); 
    }
};


export const login = async (req, res) => {

    try{

        const {username,password} = req.body;
// console.log("username",username); debug logs
// console.log("password",password);


        const user= await User.findOne({username});
        const validPassword = await bcrypt.compare(password,user?.password||" ");

     if(!user || !validPassword){
        return res.status(400).json({
            message:"Invalid user name or password",
        });}

generateTokenandSetCookie(user._id,res);  

res.status(200).json({
    _id:user._id,
    username:user.username,
    fullname:user.fullname,
    email:user.email,
    followers:user.followers,
    following:user.following,
    profilePicture:user.profilePicture,  
    coverPicture:user.coverPicture,
    bio:user.bio,
    link:user.link,
});

    }
    
    
    
    
    catch(err){
        console.error("error in login ",err.message);
        res.status(500).json({
            message:"Something went wrong in login",
        });
    
    }
    
};




export const logout = async (req, res) => {
   
try{
res.cookie("jwt","",{httpOnly:true,maxAge:0});
res.status(200).json({
    message:"Logged out successfully",
});
}

catch(err){
    console.error("error in logout ",err.message);
    res.status(500).json({
        message:"Something went wrong in logout",
    });

}

};

export const getMe= async (req,res)=>{

try{
const user=await User.findById(req.user._id).select("-password");
res.status(200).json(user);
}
catch(err){

    console.error("error in get me ",err.message);
    res.status(500).json({
        message:"Something went wrong in getMe",
    });
}

}




// // This is the getMe function manually without middelware
// export const getMe = async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     // Find the user by username
//     const user = await User.findOne({ username });

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }
   
//     // Compare the provided password with the stored hashed password
//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     // Exclude the password field from the response
//     const { password: userPassword, ...userWithoutPassword } = user.toObject();

//     res.status(200).json(userWithoutPassword);
//   } catch (err) {
//     console.error('Error in getMe', err.message);
//     res.status(500).json({ error: 'Something went wrong in getMe' });
//   }
// };
