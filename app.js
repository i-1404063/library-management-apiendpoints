const express = require("express");
const cors = require("cors");

require("dotenv").config();
const app = express();

// api documentation
//require("./utils/swagger")(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// cross origin
app.use(cors({ origin: true }));
// database connection
require("./utils/db")();

// logger
app.use(require("morgan")("dev"));

// @desc routes
app.use("/api/book", require("./routes/book"));
app.use("/api/student", require("./routes/student"));
app.use("/api/admin", require("./routes/restrict"));

// @desc express routes error handler
app.use((req, res, next) => {
  res.status(500).send({ message: "Internal Server Error" });
  next();
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is listening on: ${port}`));
