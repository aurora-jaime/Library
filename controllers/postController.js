const Libros = require('../models/Libros');
const createError = require('http-errors');

exports.getNewPost = (req, res, next) => {
  let title;
  let content;
  const data = req.flash('data')[0];

  // Verificar que exista data
  if (data) {
    // Obtener información capturada por el usuario
    title = data.title;
    content = data.content;
  }

  res.render('create', {
    errors: req.flash('validationErrors'),
    title,
    content,
  });
};

exports.getPost = async (req, res, next) => {
  try {
    const libro = await Libros.findById(req.params.id).populate({
      path: 'userId',
    });

    if (!libro) {
      return next(
        createError(404, `The post with ID ${req.params.id} was not found`),
      );
    }
    res.render('post', { libro }); // Cambié blogpost a libro
  } catch (err) {
    return next(
      createError(404, `The post with ID ${req.params.id} was not found`),
    );
  }
};

exports.createPost = async (req, res, next) => {
  try {
    // Copiar información del cuerpo de la petición
    const title = req.body.title;
    const content = req.body.content;
    // Obtener información de usuario puesta por el middleware protect (authController)
    const userId = req.user._id;

    //let author = 'John Wick';

    const newPost = await Libros.create({
      // Cambié BlogPost a Libro
      title,
      content,
      userId,
      //author,
      datePosted: new Date(),
    });

    res.redirect(303, `/posts/id/${newPost._id}`);
  } catch (err) {
    // Obtener un arreglo con los mensajes de error
    const validationErrors = Object.values(err.errors).map(
      error => error.message,
    );
    req.flash('validationErrors', validationErrors);
    // Posible información capturada por el usuario
    req.flash('data', req.body);
    res.redirect(303, '/posts/new');
  }
};
