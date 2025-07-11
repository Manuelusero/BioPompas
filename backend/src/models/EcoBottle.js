import mongoose from 'mongoose';

const ecoBottleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true }
});

const EcoBottle = mongoose.model('EcoBottle', ecoBottleSchema);
export default EcoBottle;
