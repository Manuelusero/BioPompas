import mongoose from "mongoose";

const ourStoreSchema = new mongoose.Schema({
    title: { type: String, required: true },
    image: { type: String, required: true },
    buttonText: { type: String, required: true },
    buttonUrl: { type: String, required: true }
});

const OurStore = mongoose.model("OurStore", ourStoreSchema);
export default OurStore;
