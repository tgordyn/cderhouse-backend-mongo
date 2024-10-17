import UserRepository from '../repositories/users.repository.js';
import UserDTO from '../dao/DTOs/user.dto.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const SECRET_PASSPORT = process.env.SECRET_PASSPORT;

// Registro de usuario
export const registerUser = async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;
  try {
    await UserRepository.createUser({ first_name, last_name, email, age, password });
    res.redirect('/login');
  } catch (err) {
    console.error('Error al registrar el usuario:', err);
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
};

// Inicio de sesión
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userDTO = await UserRepository.validateUser(email, password);
    if (!userDTO) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }


    const token = jwt.sign({ id: userDTO._id, role: userDTO.role }, SECRET_PASSPORT);
    console.log('token!', token)
    res.cookie('jwt', token, { httpOnly: true });
    res.redirect('/api/sessions/current');
  } catch (err) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};


export const getCurrentUser = async (req, res) => {
  try {
    if (req.user) {
      const userDTO = new UserDTO(req.user);
      res.render('profile', userDTO);
    } else {
      res.status(401).json({ error: 'No se ha autenticado correctamente' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener información del usuario' });
  }
};

// Cerrar sesión
export const logoutUser = async (req, res) => {
  try {
    res.clearCookie('jwt');
    res.redirect('/login');
  } catch (err) {
    res.status(500).send('Error al cerrar sesión');
  }
};

// Renderizar vista para restaurar contraseña
export const renderRestorePassword = (req, res) => {
  res.render('restore');
};
