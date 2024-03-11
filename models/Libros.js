const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Crear un esquema para la estructura de los documentos (posteos)
const LibrosSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Por favor, proporciona un título para el post'],
    minlength: [3, 'El título debe tener al menos 3 caracteres'],
    maxlength: [100, 'El título debe tener como máximo 100 caracteres'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Por favor, proporciona algún contenido'],
    minlength: [10, 'El contenido debe tener al menos 10 caracteres'],
    maxlength: [2000, 'El contenido debe tener como máximo 2000 caracteres'],
    trim: true,
  },
  //
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  datePosted: {
    type: Date,
    default: new Date(),
  },
});

// Crear un modelo a partir del esquema
const Libros = mongoose.model('Libros', LibrosSchema); // Cambié BlogPost a LibroPost

// Exportar el modelo
module.exports = Libros;
