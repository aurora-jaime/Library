const mongoose = require('mongoose');

const DB = process.env.LOCAL_DATABASE;

// Conectar con la base de datos blogpostsdb
exports.connectToDB = () => {
  mongoose
    .connect(DB, { useNewUrlParser: true })
    .then(() => {
      // Listening for execution errors on MongoDB
      mongoose.connection.on('error', err => {
        console.log(`MongoDB execution error: ${err}`);
      });

      console.log('Connected to MongoDB');
    })
    .catch(err => {
      console.log(`MongoDB connection error: ${err}`);
      process.exit(1); // Terminar la aplicación
    });
};
