import mongoose from 'mongoose';
import Product from './models/products.js';

mongoose.connect('mongodb+srv://dbUser:passwordUser@codercluster.lwivk.mongodb.net/?retryWrites=true&w=majority&appName=CoderCluster', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Conectado a MongoDB');

  const productosIniciales = [
    {
      title: 'Vintage Jacket',
      price: 59.99,
      category: 'Clothing',
      image: '/images/jacket.jpeg',
      stock: 10,  // Campo requerido
      status: 'available',  // Campo requerido
      code: 'VJ001',  // Campo requerido
      description: 'A stylish vintage jacket',  // Campo requerido

    },
    {
      title: 'Retro Sunglasses',
      price: 19.99,
      category: 'Accessories',
      image: '/images/sunglasses.jpeg',
      stock: 20,  // Campo requerido
      status: 'available',  // Campo requerido
      code: 'RS002',  // Campo requerido
      description: 'Retro style sunglasses',  // Campo requerido

    },
    {
      title: 'Hat',
      price: 12.99,
      category: 'Accesories',
      image: '/images/hat.jpeg',
      stock: 15,  // Campo requerido
      status: 'available',  // Campo requerido
      code: 'VJ220',  // Campo requerido
      description: 'Cool trucker cup',  // Campo requerido

    },
    {
      title: 'Jeans',
      price: 49.99,
      category: 'Clothing',
      image: '/images/jeans.webp',
      stock: 20,  // Campo requerido
      status: 'available',  // Campo requerido
      code: 'MS001',  // Campo requerido
      description: 'Comfortable and casual',  // Campo requerido

    },
    {
      title: 'Shirt',
      price: 12.99,
      category: 'Clothing',
      image: '/images/shirt.jpeg',
      stock: 25,  // Campo requerido
      status: 'available',  // Campo requerido
      code: 'CJ210',  // Campo requerido
      description: 'Retro T-shirt',  // Campo requerido

    },
    {
      title: 'Belt',
      price: 29.99,
      category: 'Accessories',
      image: '/images/belt.jpeg',
      stock: 30,  // Campo requerido
      status: 'available',  // Campo requerido
      code: 'CS100',  // Campo requerido
      description: 'Ecologic leather',  // Campo requerido

    }
  ];

  return Product.insertMany(productosIniciales);
}).then(() => {
  console.log('Productos cargados exitosamente');
  mongoose.connection.close();
}).catch((err) => {
  console.error('Error cargando productos:', err);
  mongoose.connection.close();
});
