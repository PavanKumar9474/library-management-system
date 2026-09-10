const express = require("express");

const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
    issueBook,
    getIssuedBooks,
    returnBook
} = require("../controllers/issueController");

router.post("/", protect, issueBook);

router.get("/", protect, getIssuedBooks);

router.put("/return/:id", protect, returnBook);

module.exports = router;