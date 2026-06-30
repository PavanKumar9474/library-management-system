const Book = require("../models/Book");
const Issue = require("../models/Issue");

const issueBook = async (req, res) => {
    try {

        const {
            studentName,
            studentId,
            bookId,
            issueDate
        } = req.body;

        if (
            !studentName ||
            !studentId ||
            !bookId ||
            !issueDate
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        
        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }

       
        if (book.available <= 0) {
            return res.status(400).json({
                success: false,
                message: "Book is not available"
            });
        }

        const existingIssue = await Issue.findOne({
            studentId,
            bookTitle: book.title,
            status: "Issued"
        });

        if (existingIssue) {
            return res.status(400).json({
                success: false,
                message: "This student already has this book."
            });
        }

        book.available -= 1;
        await book.save();

        const issue = await Issue.create({
            studentName,
            studentId,
            bookTitle: book.title,
            issueDate,
            status: "Issued"
        });

        res.status(201).json({
            success: true,
            message: "Book issued successfully",
            data: issue
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const getIssuedBooks = async (req, res) => {

    try {

        const issues = await Issue.find().sort({
            createdAt: -1
        });

        res.json({
            success: true,
            totalIssued: issues.length,
            data: issues
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const returnBook = async (req, res) => {

    try {

        const issue = await Issue.findById(req.params.id);

        if (!issue) {
            return res.status(404).json({
                success: false,
                message: "Issue record not found"
            });
        }

        if (issue.status === "Returned") {
            return res.status(400).json({
                success: false,
                message: "Book already returned"
            });
        }

    
        const book = await Book.findOne({
            title: issue.bookTitle
        });

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }

        book.available += 1;

        if (book.available > book.quantity) {
            book.available = book.quantity;
        }

        await book.save();
        issue.status = "Returned";
        issue.returnDate = new Date();

        await issue.save();

        res.json({
            success: true,
            message: "Book returned successfully",
            data: issue
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    issueBook,
    getIssuedBooks,
    returnBook
};