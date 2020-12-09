const router = require("express").Router();
const bcrypt = require("bcrypt");
const Student = require("../models/students");
const _ = require("lodash");
const { adminuser } = require("../utils/librarian");
const asyncHandler = require("express-async-handler");
const auth = require("../middleware/auth");

router.get(
  "/seed",
  asyncHandler(async (req, res) => {
    // await Student.remove({});
    const admin = await Student.insertMany(adminuser);
    res.send(admin);
  })
);

// @desc   Post /api/student/signin
router.post(
  "/signin",
  asyncHandler(async (req, res) => {
    const user = await Student.findOne({ email: req.body.email });
    if (user) {
      try {
        user.signIn = true;
        var newUser = await user.save();
      } catch (err) {
        return res.status(400).send({ message: err.message });
      }
      const token = newUser.generateToken();

      if (bcrypt.compareSync(req.body.password, newUser.password)) {
        res.send(token);
      } else {
        res.status(401).send({ message: "Invalid email or password" });
      }
    } else {
      res.status(401).send({ message: "Invalid email or password." });
    }
  })
);

// @desc Get /api/student/signout
router.get(
  "/signout",
  [auth],
  asyncHandler(async (req, res) => {
    const id = req.user._id;
    try {
      let student = await Student.findById(id);
      student.signIn = false;
      await student.save();
      return res.status(200).send("You logged out successfully");
    } catch (err) {
      return res.send({ message: err.message });
    }
  })
);

// @desc   Post /api/student/signup
router.post(
  "/signup",
  asyncHandler(async (req, res) => {
    try {
      let user = await Student.findOne({ email: req.body.email });
      if (user) return res.status(401).send("Student already exist.");

      user = new Student({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
      });

      user = await user.save();
      const token = await user.generateToken();
      res
        .header("x-auth-token", token)
        .header("access-control-expose-headers", "x-auth-token")
        .status(200)
        .send(_.pick(user, ["_id", "name", "email", "isAdmin", "signIn"]));
    } catch (err) {
      return res.send({ message: err.message });
    }
  })
);

module.exports = router;
