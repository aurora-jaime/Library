const Libros = require('../models/Libros');
exports.getRoot = async (req, res, next) => {
  try {
    const libros = await Libros.find().populate({
      path: 'userId',
    });
    console.log(libros);
    res.render('index', { libros });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getAbout = (req, res, next) => {
  res.render('about');
};

exports.getContact = (req, res, next) => {
  res.render('contact');
};
