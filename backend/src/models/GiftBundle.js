import mongoose from 'mongoose';

const giftBundleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: false, default: '' }
});

const GiftBundle = mongoose.model('GiftBundle', giftBundleSchema);
export default GiftBundle;
