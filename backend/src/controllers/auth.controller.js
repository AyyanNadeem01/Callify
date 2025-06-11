import User from "../models/User.js";
import jwt from "jsonwebtoken";
import {upsertStreamUser} from "../lib/stream.js";
export async function signup(req, res) {
    const { email, password, fullname } = req.body;
    try {
        if (!email || !password || !fullname) {
            return res.status(400).send("All fields are required");
        }
        if (password.length < 6) {
            return res.status(400).send("Password must be at least 6 characters long");
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).send("Invalid email format");
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send("Email already exists");
        }
        const idx = Math.floor(Math.random() * 100) + 1;
        const profilePic = `https://avatar.iran.liara.run/public/${idx}.png`;
        const newUser = await User.create({
            fullname,
            email,
            password,
            profilePic
        });
        try{
        await upsertStreamUser({
            id: newUser._id.toString(),
            name: newUser.fullname,
            image: newUser.profilePic||"",
         
        });}catch(error) {
            console.log("Error creating/updating Stream user:", error);
            return res.status(500).send("Failed to create or update Stream user");
        }
        const token = jwt.sign(
            { userId: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",

        })

        res.status(201).json({ success: true, user: newUser, token });

    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).send("Internal server error");
    }
}
export async function login(req, res) {
    try{
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send("Email and password are required");
        }
        const user=await User.findOne({ email });
        if (!user) {
            return res.status(401).send("Invalid email or password");
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).send("Invalid email or password");
        }
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });
        res.status(200).json({ success: true, user, token });
    }catch(error){
        res.status(500).json({ success: false, message: "Internal server error" });
        console.error("Error during login:", error);
    }
}
export async function logout(req, res) {
    res.clearCookie("jwt");
    res.status(200).json({ success: true, message: "Logged out successfully" });
    console.log("User logged out successfully");
    
}
export async function onboard(req, res) {
    try {
      const userId = req.user._id;
      const { fullname, bio, nativeLanguage, learningLanguage, location } = req.body;
  
      const missingFields = [];
      if (!fullname) missingFields.push("fullname");
      if (!bio) missingFields.push("bio");
      if (!nativeLanguage) missingFields.push("nativeLanguage");
      if (!learningLanguage) missingFields.push("learningLanguage");
      if (!location) missingFields.push("location");
  
      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Missing required fields: ${missingFields.join(", ")}`,
        });
      }
  
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          fullname,
          bio,
          nativeLanguage,
          learningLanguage,
          location,
          isOnboarded: true,
        },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).send("User not found");
      }
      try{await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullname,
        image: updatedUser.profilePic || "",
      });console.log(`Stream user created/updated successfully after updating user ${updatedUser._id}`);
      }catch(error){
        console.error("Error creating/updating Stream user:", error);
        return res.status(500).send("Failed to create or update Stream user");
      }
      // ✅ send a response back here
      res.status(200).json({
        success: true,
        message: "Onboarding completed successfully",
        user: updatedUser,
      });
  
    } catch (error) {
      console.error("Error during onboarding:", error);
      res.status(500).send("Internal server error");
    }
  }
  