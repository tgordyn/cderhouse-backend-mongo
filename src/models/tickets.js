import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: true,
  },
  purchase_datetime: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser: {
    type: String,
    required: true,
  },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // Asegúrate de que esta referencia sea correcta
    quantity: Number
  }],
});

ticketSchema.pre('save', async function(next) {

  this.code = `TICKET-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  next();
});

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;
