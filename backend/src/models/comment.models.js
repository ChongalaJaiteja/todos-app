const mongoose = require("mongoose");
const { Schema } = mongoose;
const commentSchema = new Schema(
    {
        text: { type: String, required: true },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        task: { type: Schema.Types.ObjectId, ref: "Task", required: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Comment", commentSchema);
