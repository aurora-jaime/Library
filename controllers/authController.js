const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res, next) => {
  try {
    // Obtener información del cuerpo de la petición por "desestructuración"
    const { name, email, password, passwordConfirm } = req.body;

    // Crear documento del usuario
    const newUser = await User.create({
      name,
      email,
      password,
      passwordConfirm,
    });

    //  Autorización usando un JSON Web Token

    // Crear el token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // Opciones de la cookie con el token que se guardará en el navegador del cliente
    const cookieOptions = {
      // Establecer tiempo de expiración de la cookie en milisegundos
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
      ),
      // Para que la cookie no pueda ser leída, solo enviada y recibida por el navegador
      httpOnly: true,
    };

    // En modo de producción (en uso real), los tokens y las cookies deben
    // viajar en una conexión https
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    // Enviar la cookie al cliente en el objeto de respuesta
    res.cookie('jwt', token, cookieOptions);

    res.redirect(303, '/');
  } catch (err) {
    let validationErrors;
    if (err.code === 11000) {
      validationErrors = ['The provided email has already been registed'];
    } else {
      // Obtener un arreglo con los mensajes de error
      validationErrors = Object.values(err.errors).map(error => error.message);
    }
    req.flash('validationErrors', validationErrors);
    // Posible información capturada por el usuario
    req.flash('data', req.body);
    res.redirect(303, '/users/new');
  }
};

exports.signin = async (req, res, next) => {
  try {
    // Obtener email y password del cuerpo de la petición por "desestructuración"
    const { email, password } = req.body;

    //Verificar si no se envió email o contraseña
    if (!email || !password) {
      req.flash('validationErrors', ['Please provide email and password']);
      req.flash('data', req.body);
      return res.redirect(303, '/users/login');
    }

    // Verificar que exista el usuario y que la contraseña sea correcta
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      req.flash('validationErrors', ['Incorrect email or password']);
      req.flash('data', req.body);
      return res.redirect(303, '/users/login');
    }

    // Crear el token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // Opciones de la cookie con el token que se guardará en el navegador del cliente
    const cookieOptions = {
      // Establecer tiempo de expiración de la cookie en milisegundos
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
      ),
      // Para que la cookie no pueda ser leída, solo enviada y recibida por el navegador
      httpOnly: true,
    };

    // En modo de producción (en uso real), los tokens y las cookies deben
    // viajar en una conexión https
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    // Enviar la cookie al cliente en el objeto de respuesta
    res.cookie('jwt', token, cookieOptions);

    return res.redirect(303, '/');
  } catch (err) {
    console.log(err);
    // Obtener un arreglo con los mensajes de error
    const validationErrors = Object.values(err.errors).map(
      error => error.message,
    );
    req.flash('validationErrors', validationErrors);
    // Posible información capturada por el usuario
    req.flash('data', req.body);
    return res.redirect(303, '/users/login');
  }
};

exports.logout = (req, res, next) => {
  const cookieOptions = {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  };

  // Invalidar la cookie con el token
  res.cookie('jwt', 'loggedout', cookieOptions);

  res.redirect(303, '/users/login');
};

exports.protect = async (req, res, next) => {
  try {
    // 1) Obtener token y verificar que exista
    const token = req.cookies.jwt;

    if (!token) {
      return res.redirect(303, '/users/login');
    }

    // 2) Verificar validez del token
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    // 3) Verificar si no existe el usuario
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return res.redirect(303, '/users/login');
    }

    // Actualizar usuario en el objeto req
    req.user = currentUser;

    // Autorizar acceso a la ruta protegida
    next();
  } catch (err) {
    return res.redirect(303, '/users/login');
  }
};

exports.isLoggedIn = async (req, res, next) => {
  // Borrar información del usuario en la variable global locals de las páginas EJS
  res.locals.user = null;

  try {
    // 1) Obtener token y verificar que exista
    const token = req.cookies.jwt;

    if (!token) {
      return next();
    }

    // 2) Verificar validez del token
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    // 3) Verificar si no existe el usuario
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return next();
    }

    // Actualizar usuario en el objeto req
    req.user = currentUser;

    // Actualizar variable en locals con la información del usuario
    res.locals.user = currentUser;

    // Permitir ejecutar el siguiente middleware
    return next();
  } catch (err) {
    return next();
  }
};
