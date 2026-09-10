const express = require("express");

const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
    addBook,
    getBooks,
    getBookById,
    updateBook,
    deleteBook
} = require("../controllers/bookController");

router.post("/", protect, addBook);

router.get("/", protect, getBooks);

router.get("/:id", protect, getBookById);

router.put("/:id", protect, updateBook);

router.delete("/:id", protect, deleteBook);

module.exports = router;