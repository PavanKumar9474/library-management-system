const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
    studentName: {
        type: String,
        required: true,
        trim: true
    },
    studentId: {
        type: String,
        required: true,
        trim: true
    },
    bookTitle: {
        type: String,
        required: true,
        trim: true
    },
    issueDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    returnDate: {
        type: Date
    },
    status: {
        type: String,
        required: true,
        enum: ["Issued", "Returned"],
        default: "Issued"
    },
    fine: {
        type: Number,
        default: 0,
        min: 0
    },
    remarks: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Issue", issueSchema);