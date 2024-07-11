const mongoose = require("mongoose");
const { Schema } = mongoose;
const taskSchema = new Schema(
    {
        title: { type: String, required: true, trim: true, maxLength: 500 },
        description: { type: String },
        priority: { type: Number, enum: [1, 2, 3, 4], default: 4 },
        dueDate: { type: Date },
        labels: [{ type: Schema.Types.ObjectId, ref: "Label" }],
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        project: { type: Schema.Types.ObjectId, ref: "Project" },
        subTasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
        comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Task", taskSchema);
