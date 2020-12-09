const jwt = require("jsonwebtoken");
const Student = require("../models/students");

module.exports = (req, res, next) => {
  const auth = req.header("x-auth-token");

  if (!auth) {
    return res
      .status(401)
      .send({ message: "Access denied! No token provided." });
  }

  jwt.verify(auth, process.env.SECRET_KEY, async (err, decoded) => {
    if (err) {
      return res.status(400).send({ message: "Invalid Token." });
    } else {
      req.user = decoded;
      const newUser = await Student.findById(req.user._id);
      if (req.user.signIn === false || newUser.signIn === false) {
        return res.status(400).send({ message: "You are not logged in." });
      }
      next();
    }
  });
};
