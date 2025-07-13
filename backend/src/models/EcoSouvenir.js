import mongoose from "mongoose";

const ecoSouvenirSchema = new mongoose.Schema({
    title: { type: String, required: true },
    image: { type: String, required: true },
    buttonText: { type: String, required: true },
    buttonUrl: { type: String, required: true }
});

const EcoSouvenir = mongoose.model("EcoSouvenir", ecoSouvenirSchema);
export default EcoSouvenir;
