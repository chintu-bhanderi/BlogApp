import mongoose from "mongoose";
import Blog from "../model/Blog.js";
import User from "../model/User.js";

export const getAllBlogs = async (req, res, next) => {
    let blogs;
    try {
        blogs = await Blog.find().populate('user');

    } catch (e) {
        return console.log(err);
    }
    if (!blogs) {
        return res.status(404).json({ message: "No Blog foud" });
    }
    // console.log(blogs);
    return res.status(200).json({ blogs });
}

export const addBlog = async (req, res, next) => {
    const { title, description, image, user } = req.body;
    let existingUser;
    try{
        existingUser = await User.findById(user);
    } catch (e) {
        console.log(e);
    }
    // console.log(existingUser);
    if(!existingUser) {
        return res.status(404).json({ message: "anable to find user By this Id"});
    }
    const blog = new Blog({
        title,
        description,
        image,
        user
    });
    try {
        // await blog.save();
        const session = await mongoose.startSession();
        session.startTransaction();
        await blog.save({session});
        existingUser.blogs.push(blog);
        await existingUser.save({session});
        await session.commitTransaction();
    } catch (e) {
        console.log(e);   
        return res.status(500).json({ message : e});
    }
    console.log(blog);
    return res.status(201).json({ blog });
}

export const updateBlog = async (req, res, next) => {
    const { title, description , image } = req.body;
    const blogId = req.params.id;
    let blog;
    try {
        console.log(title);
        blog = await Blog.findByIdAndUpdate(blogId, {
            title,
            description,
            image
        });
    } catch (err) {
        return console.log(err);
    }
    if(!blog){
        return res.status(404).json({message:"Unable to update the blog"});
    }
    // save is remeining..
    console.log(blog);
    return res.status(201).json({blog});
    // return res.status(201).json({});
}   

export const getById = async (req, res, next) => {
    const id = req.params.id;
    let blog;
    try{
        blog = await Blog.findById(id);
    } catch (err) {
        return console.log(err);
    }
    if(!blog){
        return res.status(404).json({message:"No Blog Found"});
    }
    console.log(blog);
    return res.status(201).json({blog});
}

export const deleteById = async (req, res, next) => {
    const id = req.params.id;

    let blog;
    try{
        blog = await Blog.findByIdAndRemove(id).populate('user');
        await blog.user.blogs.pull(blog);
        await blog.user.save();
    } catch (err) {
        return console.log(err);
    }   
    if(!blog) {
        return res.status(404).json({message: "anable to delete"});
    }
    return res.status(201).json({message:"successfully delete"});
};

export const getByUserId = async (req, res, next) => {
    const userId = req.params.id;
    let userBlogs;
    // console.log(userId);
    try{
        userBlogs = await User.findById(userId).populate("blogs");
    } catch(e){
        return console.log(err);
    }
    // console.log(2);
    if(!userBlogs){
        return res.status(404).json({message: "No Blog found"});
    }
    // console.log(3);
    return res.status(200).json({user: userBlogs});
}