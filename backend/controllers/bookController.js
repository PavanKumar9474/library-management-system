const Book = require("../models/Book");

const addBook = async (req, res) => {
    try {

        const {
            title,
            author,
            category,
            isbn,
            year,
            quantity,
            available
        } = req.body;

        if (
            !title ||
            !author ||
            !category ||
            !isbn ||
            !year ||
            !quantity ||
            available === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const existingBook = await Book.findOne({ isbn });

        if (existingBook) {
            return res.status(400).json({
                success: false,
                message: "Book with this ISBN already exists"
            });
        }

        const book = await Book.create({
            title,
            author,
            category,
            isbn,
            year,
            quantity,
            available
        });

        res.status(201).json({
            success: true,
            message: "Book added successfully",
            data: book
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const getBooks = async (req, res) => {

    try {

        const { search } = req.query;

        let filter = {};

        if (search) {

            filter = {
                $or: [
                    {
                        title: {
                            $regex: search,
                            $options: "i"
                        }
                    },
                    {
                        author: {
                            $regex: search,
                            $options: "i"
                        }
                    },
                    {
                        category: {
                            $regex: search,
                            $options: "i"
                        }
                    }
                ]
            };

        }

        const books = await Book.find(filter).sort({
            createdAt: -1
        });

        res.json({
            success: true,
            totalBooks: books.length,
            data: books
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const getBookById = async (req, res) => {

    try {

        const book = await Book.findById(req.params.id);

        if (!book) {

            return res.status(404).json({
                success: false,
                message: "Book not found"
            });

        }

        res.json({
            success: true,
            data: book
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const updateBook = async (req, res) => {

    try {

        const book = await Book.findById(req.params.id);

        if (!book) {

            return res.status(404).json({
                success: false,
                message: "Book not found"
            });

        }

        const issuedBooks = book.quantity - book.available;

        const {
            title,
            author,
            category,
            isbn,
            year,
            quantity
        } = req.body;

        if (isbn && isbn !== book.isbn) {

            const exists = await Book.findOne({ isbn });

            if (exists) {

                return res.status(400).json({
                    success: false,
                    message: "ISBN already exists"
                });

            }

            book.isbn = isbn;

        }

        book.title = title;
        book.author = author;
        book.category = category;
        book.year = year;
        book.quantity = quantity;

        book.available = quantity - issuedBooks;

        if (book.available < 0) {
            book.available = 0;
        }

        await book.save();

        res.json({
            success: true,
            message: "Book updated successfully",
            data: book
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const deleteBook = async (req, res) => {

    try {

        const book = await Book.findById(req.params.id);

        if (!book) {

            return res.status(404).json({
                success: false,
                message: "Book not found"
            });

        }

        await Book.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Book deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    addBook,
    getBooks,
    getBookById,
    updateBook,
    deleteBook
};