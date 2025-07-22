import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePic: {
        type: String 
    },
    favorites: {
        type: [String], 
        default: []
    },
    bag: {
        type: [String],
        default: []
    },
    sold: {
        type: [String],
        default: []
    },
    bought: {
        type: [String],
        default: []
    },
    listed: {
        type: [String],
        default: []
    }
}, { timestamps: true });

export const User = mongoose.model("info", userSchema);