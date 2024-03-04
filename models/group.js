const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types


const groupSchema = new mongoose.Schema({
    groupName: {
        required: true,
        type: String
    },
    members: [{
        type: ObjectId, ref: "USER"
    }]
}, { timestamps: true });

mongoose.Model("GROUP", groupSchema);