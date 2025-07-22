import mongoose from "mongoose";

const feedbackSchema = mongoose.Schema({

    name:{
        type: String,
        required: [true, "Name is required"]
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
    feedback:{
        type: String,
        required: [true, "Feedback is required"],
        maxlength: [500, "Feedback should not exceed 500 characters"]
    }
}, {timestamps:true});

export const Feedback = mongoose.model("feedbacks/bugs", feedbackSchema);