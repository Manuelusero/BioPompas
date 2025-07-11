import mongoose from "mongoose";

const topPickSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true }
});

const TopPick = mongoose.model("TopPick", topPickSchema);

export default TopPick;
