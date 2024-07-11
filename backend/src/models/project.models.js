const mongoose = require("mongoose");
const { Schema } = mongoose;
const projectSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
        collaborators: [
            {
                user: { type: Schema.Types.ObjectId, ref: "User" },
                permissions: {
                    type: String,
                    enum: ["read", "write", "admin"],
                    default: "read",
                },
            },
        ],
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Project", projectSchema);
