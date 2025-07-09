import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
  
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    url: {
      type: String, 
    },
    isFeatured: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }

);

const Product = mongoose.model('Product', productSchema);
export default Product;
