import mongoose, { model, models, Schema } from "mongoose";

const appiontmentSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            index: true
        },
        description: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        area: {
            type: String,
            required: true,
        },
        preferredDate: {
            type: String,
            required: true,
        },
        preferredTime: {
            type: String,
            required: true,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        status:{
            type:String,
            enum:["Pending","Progress","Rejected","Completed"]
        }

    },
    { timestamps: true }
);

const Appiontment = models.Appiontment || model("Appiontment", appiontmentSchema);

export default Appiontment;