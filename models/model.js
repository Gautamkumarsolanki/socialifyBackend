const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: ""
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    Photo: {
        type: String,
    },
    bio: {
        type: String,
        default: ""
    },
    followers: [{ name: { type: String, default: "" }, userName: { type: String, required: true }, photo: { type: String, default: "" } }],
    following: [{ name: { type: String, default: "" }, userName: { type: String, required: true }, photo: { type: String, default: "" } }],
    groups: [{ type: ObjectId, ref: "GROUP" }],
    userFeed: [{ type: String }]
}, { timestamps: true });

mongoose.model("USER", userSchema)

