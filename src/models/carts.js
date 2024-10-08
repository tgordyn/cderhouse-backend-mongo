import mongoose from "mongoose";

const cartsCollection = "carts";

const cartsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Relacionando con el modelo de User
    required: true
  },
  products: { // Cambiado de `product` a `products` para mayor claridad
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // Asegúrate de que el modelo de Producto sea correcto
          required: true // Asegúrate de que siempre haya un producto asociado
        },
        quantity: {
          type: Number,
          required: true, // El campo es requerido
          min: 1, // Cantidad mínima de 1
          default: 1 // Valor por defecto
        },
      },
    ],
    default: [],
  },
});

// Método para agregar productos al carrito
cartsSchema.methods.addProduct = async function (productId, quantity = 1) {
  const existingProductIndex = this.products.findIndex( // Cambiado a `this.products`
    (p) => p.product.toString() === productId.toString()
  );

  if (existingProductIndex > -1) {
    // Si el producto ya existe, actualizar la cantidad
    this.products[existingProductIndex].quantity += quantity;
  } else {
    // Si el producto no está en el carrito, agregarlo
    this.products.push({ product: productId, quantity });
  }

  return this.save(); // Guardar cambios en el carrito
};

// Método para eliminar un producto del carrito
cartsSchema.methods.removeProduct = async function (productId) {
  this.products = this.products.filter( // Cambiado a `this.products`
    (p) => p.product.toString() !== productId.toString()
  );
  return this.save();
};

// Método para vaciar el carrito
cartsSchema.methods.clearCart = async function () {
  this.products = []; // Cambiado a `this.products`
  return this.save();
};

const Cart = mongoose.model(cartsCollection, cartsSchema);
export default Cart;
