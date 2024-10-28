import User from '../models/usermodel.js'; // Adjust the path as necessary
import Post from '../models/postmodel.js';

// Bookmark a post
export const bookmarkPost = async (req, res) => {
    const { userId, postId } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        // Check if the post is already bookmarked
        if (!user.bookmarkedPosts.includes(postId)) {
            user.bookmarkedPosts.push(postId);
            await user.save();
            return res.status(201).json({ message: "Post bookmarked successfully" });
        } else {
            return res.status(400).json({ message: "Post already bookmarked" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

// Remove a bookmark
export const removeBookmark = async (req, res) => {
    const { userId, postId } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Check if the post is bookmarked
        if (user.bookmarkedPosts.includes(postId)) {
            user.bookmarkedPosts = user.bookmarkedPosts.filter((id) => id.toString() !== postId);
            await user.save();
            return res.status(200).json({ message: "Post removed from bookmarks" });
        } else {
            return res.status(400).json({ message: "Post not found in bookmarks" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}