const router = require("express").Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const Book = require("../models/books");
const asyncHandler = require("express-async-handler");

// @desc Get /api/admin/deactivated   active==true
router.patch(
  "/deactivated/:id",
  [auth, admin],
  asyncHandler(async (req, res) => {
    try {
      await Book.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            active: req.body.active,
          },
        },
        { new: true }
      );
      res.status(200).send("Succesfully restricted to the users.");
    } catch (err) {
      res.send({ message: err.message });
    }
  })
);

// @desc Get /api/admin/activated active==false
router.patch(
  "/activated/:id",
  [auth, admin],
  asyncHandler(async (req, res) => {
    try {
      await Book.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            active: req.body.active,
          },
        },
        { new: true }
      );
      res.status(200).send("Successfully unrestricted to the users.");
    } catch (err) {
      res.send({ message: err.message });
    }
  })
);

module.exports = router;
