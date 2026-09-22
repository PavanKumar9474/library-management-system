const Book = require("../models/Book");
const Issue = require("../models/Issue");
const sendEmail = require("../services/emailService");

const issueBook = async (req, res) => {
    try {

        const {
            studentName,
            studentId,
            studentEmail,
            bookId,
            issueDate,
            remarks
        } = req.body;

        if (
            !studentName ||
            !studentId ||
            !studentEmail ||
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

        const issueDateObj = new Date(issueDate);
        const dueDate = new Date(issueDateObj);
        dueDate.setDate(dueDate.getDate() + 14); // 14 days borrowing period

        const issue = await Issue.create({
            studentName,
            studentId,
            studentEmail,
            bookTitle: book.title,
            issueDate: issueDateObj,
            dueDate,
            status: "Issued",
            remarks
        });
        
        await sendEmail({
            email: studentEmail,
            subject: "Book Issued - Library Management System",
            message: `Hello ${studentName},\n\nYou have successfully borrowed "${book.title}". Please return it by ${dueDate.toDateString()}.\n\nThank you!`
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
        
        // Fine Calculation
        const today = new Date();
        let fine = 0;
        if (today > issue.dueDate) {
            const diffTime = Math.abs(today - issue.dueDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            fine = diffDays * 1; // $1 per day
        }
        issue.fine = fine;

        await issue.save();
        
        await sendEmail({
            email: issue.studentEmail,
            subject: "Book Returned - Library Management System",
            message: `Hello ${issue.studentName},\n\nYou have successfully returned "${book.title}". ${fine > 0 ? 'Your late fine is $' + fine + '.' : 'Thank you for returning it on time!'}`
        });

        res.json({
            success: true,
            message: `Book returned successfully. ${fine > 0 ? 'Fine: $' + fine : ''}`,
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