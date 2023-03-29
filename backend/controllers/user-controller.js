import User from "../model/User.js";
import bcrypt from 'bcryptjs';
// console.log("Hellow");

const getAllUser = async (req , res , next) => {
    let users;
    try{
        users = await User.find();
        
    } catch(err){
        console.log(err);
    }
    if(!users){
        return res.status(404).json({message: "No users found"});
    }
    console.log(users);
    return res.status(201).json({users});
    // return res.status(200).json({a:"raxit"});
}

// console.log("Hello");
export const signup = async (req , res , next) => {
    const {name,email,password} = req.body;
    let existingUser;
    try{
        existingUser = await User.findOne({email});
    } catch(err) {
        return console.log(err);
    }
    if(existingUser) {
        return res.status(400).json({master:"User Already Exists!"});
    }
    const hashPass = bcrypt.hashSync(password);

    const user = new User({
        name,
        email,
        password: hashPass ,
        blogs : []
    });

    try{
        await user.save();
    } catch(err) {
        return console.log(err);        
    }
    
    return res.status(201).json({user});
}

// console.log("Hello");

export const login = async (req , res , next) => {
    const {email,password} = req.body;
    console.log(1);
    let existingUser;
    try{
        existingUser = await User.findOne({email});
    } catch(err) {
        return console.log(err);
    }
    console.log(2);
    if(!existingUser) {
        return res.status(404).json({master:"Couldn't find by this Email"});
    }
    console.log(3);
    const isPassCorrect = bcrypt.compareSync(password,existingUser.password);
    if(!isPassCorrect){
        return res.status(404).json({master:"Incorrect Password"});
    }
    console.log(4);
    return res.status(201).json({message:"Login Successfull",user:existingUser});

};

// console.log("Hii");

export default getAllUser;
