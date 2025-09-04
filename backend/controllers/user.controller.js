import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import Post from "../models/post.model.js";

export const register = async (req,res) => {
    try {
        const {username, email, password} = req.body;

        if (!username || !email || !password){
            return res.status(401).json({
                message: "Something is missing, please check!",
                success: false,
            })
        }

        const user = await User.findOne({email});

        if(user){
            return res.status(401).json({
                message: "User already exist, please login or try different email.",
                success: false,
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            username,
            email,
            password:hashedPassword,
        })

        return res.status(201).json({
                message: "Account created successfully.",
                success: true,
        })

    } catch (error) {
        console.log(error);
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({ 
                message: "Something is missing, please check!", 
                success: false });
        }

        const user = await User.findOne({ email })
            .select("+password")
            .populate({
                path: "followings",
                select: "-password",  // exclude password field
            });

        if (!user) {
            return res.status(401).json({ 
                message: "User does not exist, please signup or try different email.", 
                success: false });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ 
                message: "Incorrect email or password.", 
                success: false });
        }

        const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });

        const populatedPosts = await Promise.all(
            user.posts.map(async(postId)=>{
                const post = await Post.findById(postId);
                if(post.author.equals(user._id)){
                    return post;
                }
                return null;
            }
            ))

        const { password: pw, ...userSafe } = user.toObject();

        userSafe.posts = populatedPosts.filter(post => post !== null);

        return res
            .cookie("token", token, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 1 * 24 * 60 * 60 * 1000, path: '/' })
            .json({
                message: `Welcome back ${userSafe.username}`,
                success: true,
                user: userSafe,
            });
    } catch (error) {
        console.log(error);
    }
};


export const logout = async (_,res) => {
    try {
        return res
        .clearCookie("token", { httpOnly: true, sameSite: 'None', secure: true, path: '/' })
        .json({
            message: "Logout successfully",
            success: true,
        })
    } catch (error) {
        console.log(error);
    }
}

export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        await user.populate("posts");

        return res.status(200).json({
            message: "User found",
            success: true,
            user,
        });
    } catch (error) {
        console.log(error);
    }
};

export const editProfile = async (req,res) => {
    try {
        const userId = req.id;
        const {bio, gender} = req.body;
        const profilePicture = req.file;

        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({
                message: "User not found",
                success: false,
            })
        }

        let cloudResponse;

        if(profilePicture){
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
            user.profilePicture = cloudResponse.secure_url;
        }

        if(bio){
            user.bio = bio;
        }

        if(gender){
            user.gender = gender;
        }

        await user.save();

        return res.status(200).json({
            message: "Profile updated successfully",
            success: true,
            user
        })
    } catch (error) {
        console.log(error);
    }
}

export const followOrUnfollow = async (req,res) => {
    try {
        const followkrnevala = req.id;
        const jiskofollowkra = req.params.id;

        if(followkrnevala === jiskofollowkra){
            return res.status(400).json({
                message: "you cannot follow or unfollow yourself.",
                success : false
            })
        }

        const user = await User.findById(followkrnevala);
        const targetUser = await User.findById(jiskofollowkra);

        if(!user || !targetUser){
            return res.status(400).json({
                message: "User not found",
                success : false
            })
        }

        const isFollowing = user.followings.includes(jiskofollowkra);
        if(isFollowing){
            await Promise.all([
                User.updateOne({_id:followkrnevala},{$pull: {followings:jiskofollowkra}}),
                User.updateOne({_id:jiskofollowkra},{$pull: {followers:followkrnevala}}),
            ])
            return res.status(400).json({
                message: "Unfollow successfull",
                success : true
            })
        }else{
            await Promise.all([
                User.updateOne({_id:followkrnevala},{$push: {followings:jiskofollowkra}}),
                User.updateOne({_id:jiskofollowkra},{$push: {followers:followkrnevala}}),
            ])
            return res.status(400).json({
                message: "Follow successfull",
                success : true
            })
        }

    } catch (error) {
        console.log(error);
    }
}

export const searchUsersByUsername = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.trim().length === 0) {
            return res.status(400).json({
                message: "Query parameter 'q' is required",
                success: false,
            });
        }

        const regex = new RegExp(q, 'i');

        const users = await User.find({ username: { $regex: regex } })
            .select("-password")
            .limit(20);

        return res.status(200).json({
            success: true,
            users,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}