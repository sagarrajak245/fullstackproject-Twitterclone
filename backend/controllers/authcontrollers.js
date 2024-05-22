
import User from '../models/user';
import bcrypt from 'bcryptjs';





export const signup = async (req, res) => {
  try{

    const {username,fullname,password,email} = req.body;
    const emailRegex = /\S+@\S+\.\S+/;
    if(!emailRegex.test(email)){
        return res.status(400).json({
            message:"Invalid email",
        });
    }
const userExists = await User.findOne({username});
if(userExists){
    return res.status(400).json({
        message:"Username is taken",
    });
}

    const emailExists= await User.findone({email});
    if(emailExists){
        return res.status(400).json({
            message:"Email is taken",
        });
    }   

const salt= await bcrypt.genSalt(10);
const passwordHash= await bcrypt.hash(password,salt);
const newUser = new User({
    username,
    fullname,
    password:passwordHash,
    email,
});




}
catch(err){
    console.error(`Error to connection: ${err.message}`);
process.exit(1);
}



};


export const logout = async (req, res) => {
    res.json({
        data: 'you hit logout endpoint'
    });
}


export const login = async (req, res) => {
    res.json({
        data: 'you hit login endpoint'
    });
}