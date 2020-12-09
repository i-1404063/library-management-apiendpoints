const router = require("express").Router();
const base64 = require("image-to-base64");
const Book = require("../models/books");
const asyncHandler = require("express-async-handler");
const validateId = require("../middleware/validateId");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const _ = require("lodash");

// @desc Get /api/book
router.get(
  "/",
  [auth],
  asyncHandler(async (req, res) => {
    try {
      let books = await Book.find({});
      return res
        .status(200)
        .send(
          books.map((book) =>
            book.active
              ? `${book._id} is not available for user`
              : _.pick(book, [
                  "_id",
                  "bookName",
                  "author.name",
                  "author.email",
                  "genre",
                ])
          )
        );
    } catch (err) {
      return res.status(404).send({ message: err.message });
    }
  })
);

// @desc Get /api/book/:id
router.get(
  "/:id",
  [validateId, auth],
  asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (!book)
      return res.status(404).send("Book with the given id was not found.");

    if (book.active) return res.send("The resource is restricted for users.");
    return res
      .status(200)
      .send(_.pick(book, ["bookName", "author.name", "author.email", "genre"]));
  })
);

// @desc Delete /api/book/:id
router.delete(
  "/:id",
  [validateId, auth, admin],
  asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (!book)
      return res.status(404).send("Book with the given id was not found.");

    const newBook = await book.remove();
    return res.status(200).send(newBook);
  })
);

// @desc Put /api/book
router.patch(
  "/:id",
  [validateId, auth, admin],
  asyncHandler(async (req, res) => {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          bookName: req.body.bookName,
          genre: req.body.genre,
          author: {
            email: req.body.email,
          },
        },
      },
      { new: true }
    );

    return res
      .status(200)
      .send(_.pick(book, ["bookName", "author.email", "genre"]));
  })
);

// @desc Post /api/book
router.post(
  "/",
  [auth, admin],
  asyncHandler(async (req, res) => {
    const book = { ...req.body };

    try {
      const bookImage = await base64(book.bookImage);
      let newBook = new Book({
        bookName: book.bookName,
        author: book.author,
        genre: book.genre,
        bookImage: bookImage,
      });
      newBook = await newBook.save();
      res.send(newBook);
    } catch (err) {
      res.send({ message: err.message });
    }
  })
);

module.exports = router;
