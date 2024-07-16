const mongoose = require("mongoose");

const { Schema } = mongoose;
const labelSchema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true },
);

exports.Label = mongoose.model("Label", labelSchema);
