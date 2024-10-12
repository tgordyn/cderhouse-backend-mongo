
import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserDTO from '../dao/DTOs/user.dto.js';

class UserRepository {
  async createUser(userData) {
    const { password, ...rest } = userData;
    console.log("Contraseña antes de encriptar:", password);
    const newUser = new User({ ...rest, password });
    return await newUser.save();
}

  async findByEmail(email) {
    return await User.findOne({ email }).lean();
  }

  async findById(userId) {
    return await User.findById(userId).lean();
  }

  async validateUser(email, password) {
    const user = await this.findByEmail(email);

    if (!user) return null;


    console.log("Contraseña ingresada:", password);
    console.log("Contraseña almacenada:", user.password);
    const isValid = bcrypt.compareSync(password.trim(), user.password);

    // Verifica si la comparación es verdadera
    return isValid ? new UserDTO(user) : null;
  }

  async updateUser(userId, userData) {
    return await User.findByIdAndUpdate(userId, userData, { new: true }).lean();
  }

  async logoutUser(req) {
    req.session.destroy(err => {
      if (err) throw new Error("Error al cerrar sesión");
    });
  }

  generateToken(userId) {
    return jwt.sign({ id: userId }, SECRET_PASSPORT );;
  }
}

export default new UserRepository();
