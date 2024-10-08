import express from "express";
import Ticket from '../../models/tickets.js';
import { isAuthenticated } from '../../middleware/auth.js';

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

export default router;
