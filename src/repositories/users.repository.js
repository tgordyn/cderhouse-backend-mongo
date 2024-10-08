
import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserDTO from '../dao/DTOs/user.dto.js';

class UserRepository {
  async createUser(userData) {
    const { password, ...rest } = userData;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({ ...rest, password: hashedPassword });
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

    const isValid = bcrypt.compareSync(password, user.password);
    return isValid ? new UserDTO(user) : null; // Retorna un DTO si la contraseña es válida
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
    return jwt.sign({ id: userId }, SECRET_PASSPORT, { expiresIn: '1h' });;
  }
}

export default new UserRepository();
