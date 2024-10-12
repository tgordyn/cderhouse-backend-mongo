import { Router } from "express";
import { isAuthenticated } from "../../middleware/auth.js";
import { getTicketById, sendTicketByEmail, sendTicketBySms } from "../../controllers/ticketController.js";

const router = Router();

// Obtener detalle del ticket
router.get("/:ticketId", isAuthenticated, getTicketById);

// Enviar ticket por correo
router.post("/:id/mail", isAuthenticated, sendTicketByEmail);

// Enviar ticket por SMS
router.post("/:id/sms", isAuthenticated, sendTicketBySms);

export default router;
