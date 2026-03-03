    import mongoose, { model, models, Schema } from "mongoose";

    const contactSchema = new Schema(
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

        phone: {
        type: String,
        required: true
        },

        subject: {
        type: String,
        required: true
        },

        Inquiry: {
        type: String,
        required: true
        },

        userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
        },

        status: {
        type: String,
        enum: ["Pending", "Progress", "Rejected", "Completed"],
        default: "Pending"
        }

    },
    { timestamps: true }
    );

    const Contact = models.Contact || model("Contact", contactSchema);

    export default Contact;