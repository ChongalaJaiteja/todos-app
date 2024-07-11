const mongoose = require("mongoose");

const { Schema } = mongoose;
const labelSchema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Label", labelSchema);
