import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userCollection = "Users";

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: { type: String, unique: true },
    age: Number,
    password: String,
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    role: { type: String, default: 'user' }
});

userSchema.pre('save', function (next) {
  if (this.isModified('password') || this.isNew) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
  }
  next();
});

const User = mongoose.model('User', userSchema);
export default User;
