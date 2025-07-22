import mongoose from "mongoose";

const productDataSchema = mongoose.Schema({

    name:{
        type: String,
        required: [true, "Name is required"],
        minlength: [3, "Name must be at least 3 characters long"]
    },
    description:{
        type: String,
        required: [true, "Description is required"],
        maxlength: [500, "Description should not exceed 500 characters"]
    },
    material:{
        type: String,
        required: [true, "Material is required"],
    },
    old:{
        type: String,
        enum: ["new", "used", "mended", "New", "Used", "Mended"], 
        required: [true, "Condition is required"]

    },
    cost:{
        type: Number,
        required: [true, "Cost is required"],
        min: [1, "Cost must be at least ₹1"],
        validate: {
           validator: function(value) {
                return Number.isInteger(value); 
            },
            message: props => `${props.value} is not a valid integer!`
        }
    },
    styleFit:{
        type: String,
        enum:["Female Fit", "Male Fit", "female fit", "male fit", "Female fit", "Male fit"],
        required: [true, "Style fit is required"]
    },
    type:{
        type: String,
        enum:["Clothing", "Accessories", "clothing", "accessories"],
        required: [true, "Type is required"]
    },
    size:{
        type: String,
        enum:["xxs","xs","s","m","l","xl","xxl","xxxl", "XXS","XS","S","M","L","XL","XXL","XXXL"],
        required: [true, "Size is required"]
    },
    email:{
        type: String,
        required: [true, "Email is required"],
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email format!`
        }
    },
    image:{
        type: String, 
        required: [true, "Image is required"]
    },
    upi:{
        type: String,
        required: [false]
    },
    postedAt: {
       type: Date,
       default: Date.now
    },
    sellerId: {
       type: mongoose.Schema.Types.ObjectId,
       ref: "info", 
       required: true
    },
    isSold: {
       type: Boolean,
       default: false
    }


}, {timestamps:true});

export const Product =  mongoose.model("productInfo", productDataSchema);