import mongoose from "mongoose";

const cartsCollection = "carts";

const cartsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1
        },
      },
    ],
    default: [],
  },
});

// Método para agregar productos al carrito
cartsSchema.methods.addProduct = async function (productId, quantity = 1) {
  const existingProductIndex = this.products.findIndex(
    (p) => p.product.toString() === productId.toString()
  );

  if (existingProductIndex > -1) {

    this.products[existingProductIndex].quantity += quantity;
  } else {

    this.products.push({ product: productId, quantity });
  }

  return this.save();
};

// Método para eliminar un producto del carrito
cartsSchema.methods.removeProduct = async function (productId) {
  this.products = this.products.filter(
    (p) => p.product.toString() !== productId.toString()
  );
  return this.save();
};

// Método para vaciar el carrito
cartsSchema.methods.clearCart = async function () {
  this.products = [];
  return this.save();
};

const Cart = mongoose.model(cartsCollection, cartsSchema);
export default Cart;
