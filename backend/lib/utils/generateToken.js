import jwt from 'jsonwebtoken';

export const generateTokenandSetCookie = (userId, res) => { 
    console.log("Function called with userId:", userId); // Added log
    try {
        // Generate the token
        const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
            expiresIn: "15d", // Token expiration time
        });   

        // Set the cookie with the token
        res.cookie("jwt", token, {
            httpOnly: true, // Prevents client-side access to the cookie
            maxAge: 15 * 24 * 60 * 60 * 1000, // Set cookie expiration to match token expiration
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            sameSite: "strict", // Helps protect against CSRF attacks
        });
 
        console.log("Token generated and cookie set:", token); // Debugging log (remove in production)
    } catch (error) {
        console.error("Error generating token or setting cookie:", error);
        throw new Error("Failed to generate token and set cookie");
    }
}; 