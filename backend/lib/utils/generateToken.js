import jwt from 'jsonwebtoken';


export const generateTokenandSetCookie = (userId, res) => {
const  token =jwt.sign({id:userId},process.env.JWT_SECRET,{
    expiresIn:"15d",
});
 
res.cookie("jwt",token,{

    httpOnly:true,
    maxAge:10*24*60*60*1000, //xss attacks secure
    secure:process.env.NODE_ENV!=="development",
    sameSite:"strict",//csrf attacks secure
})





}