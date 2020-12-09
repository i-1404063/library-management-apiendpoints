const mongoose = require("mongoose");

module.exports = async function () {
  try {
    const con = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    if (con) console.log(`Database connected to: ${con.connection.host}`);
  } catch (err) {
    console.log("Database could not connect");
  }
};
