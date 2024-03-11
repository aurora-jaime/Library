const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const bcrypt = require('bcryptjs');

// Crear un esquema para la estructura de los documentos (posteos)
const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    minlength: [2, 'Name must have at least 3 characters'],
    maxlength: [100, 'Name must be at most 100 characters long'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    lowercase: true,
    unique: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must have at least 8 characters'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (pass) {
        return pass === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
});

// Middleware para encriptar la contraseña antes de guardarla
UserSchema.pre('save', async function (next) {
  // Verificar si no se modificó la contraseña para no encriptar la contraseña
  // ya encriptada
  if (!this.isModified('password')) return next();

  // Encriptar la contraseña
  this.password = await bcrypt.hash(this.password, 12);

  // No guardar el campo de confirmación de contraseña
  this.passwordConfirm = undefined;

  // Continuar con el siguiente paso de la secuencia
  next();
});

// Método de instancia para comprobar que la contraseña sea correcta,
// mediante la comparación de las contraseñas encriptadas
UserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Crear un modelo a partir del esquema
const User = mongoose.model('User', UserSchema);

// Exportar el modelo
module.exports = User;
