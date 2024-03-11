// const User = require('../models/User');
// const createError = require('http-errors');

exports.getNewUser = (req, res, next) => {
  let name;
  let email;
  const data = req.flash('data')[0];
  

  // Verificar que exista data
  if (data) {
    // Obtener información capturada por el usuario
    name = data.name;
    email = data.email;
  }

  res.render('register', {
    errors: req.flash('validationErrors'),
    name,
    email,
  });
};

exports.logInUser = (req, res, next) => {
  let email;
  const data = req.flash('data')[0];

  // Verificar que exista data
  if (data) {
    // Obtener información capturada por el usuario
    email = data.email;
  }
  res.render('login', {
    errors: req.flash('validationErrors'),
    email,
  });
}; // const User = require('../models/User');
// const createError = require('http-errors');

exports.getNewUser = (req, res, next) => {
  let name;
  let email;
  const data = req.flash('data')[0];

  // Verificar que exista data
  if (data) {
    // Obtener información capturada por el usuario
    name = data.name;
    email = data.email;
  }

  res.render('register', {
    errors: req.flash('validationErrors'),
    name,
    email,
  });
};

exports.logInUser = (req, res, next) => {
  let email;
  const data = req.flash('data')[0];

  // Verificar que exista data
  if (data) {
    // Obtener información capturada por el usuario
    email = data.email;
  }

  res.render('login', {
    errors: req.flash('validationErrors'),
    email,
  });
};
