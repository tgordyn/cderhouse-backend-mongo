import express from "express";
import Ticket from '../../models/tickets.js';
import { isAuthenticated } from '../../middleware/auth.js';
import mailTransporter from '../../utils/mailTransporter.js';
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();



router.get('/:ticketId', isAuthenticated, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket no encontrado.' });
    }
    const ticketObject = ticket.toObject();

    res.render('ticketDetail', { ticket: ticketObject });
  } catch (err) {
    console.error('Error al obtener el ticket:', err);
    res.status(500).send('Error al obtener el ticket');
  }
});

router.post('/:id/mail', isAuthenticated, async (req, res) => {
  const ticketId = req.params.id;
  console.log('hola!!')
  console.log('Ticket ID:', ticketId);
  try {
    const ticket = await Ticket.findById(ticketId).populate('products.product').lean();
    const user = req.user;

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket no encontrado' });
    }

    const mailOptions = {
      from: process.env.MAIL,
      to: user.email,
      subject: 'Tu ticket de compra',
      text: `Hola ${user.first_name}, gracias por tu compra! Aquí tienes el detalle de tu ticket:
      Número de Ticket: ${ticket._id}
      Productos: ${ticket.products.map(item => `${item.product.title} - Cantidad: ${item.quantity}`).join('\n')}
      Total: $${ticket.amount}`,
    };

    await mailTransporter.sendMail(mailOptions);
    return res.status(200).send('Correo enviado exitosamente');

  } catch (error) {
    console.error('Error al enviar el correo:', error);
    return res.status(500).send('Error al enviar el correo');
  }
});

export default router;
