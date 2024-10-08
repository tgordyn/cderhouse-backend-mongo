import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['available', 'unavailable'], // Puedes ajustar los estados según necesites
  },
  code: {
    type: String,
    required: true,
    unique: true // Para asegurar que cada producto tenga un código único
  },
  description: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
