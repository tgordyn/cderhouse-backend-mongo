import { Router } from 'express';
import {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  renderRestorePassword
} from '../../controllers/sessionController.js';
import { passportCall } from '../../utils/passportUtils.js';

const router = Router();

// Registro de usuario
router.post('/register', registerUser);

// Inicio de sesión
router.post('/login', loginUser);

// Ruta "current" para validar al usuario logueado
router.get('/current', passportCall('jwt'), getCurrentUser);

// Cerrar sesión
router.post('/logout', logoutUser);

// Renderizar vista para restaurar contraseña
router.get('/restore', renderRestorePassword);

export default router;
