const Book = require("../models/Book");
const Issue = require("../models/Issue");

const getDashboard = async (req, res) => {
    try {
        const totalBooks = await Book.countDocuments();

        const availableBooks = await Book.aggregate([
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$available"
                    }
                }
            }
        ]);

        const issuedBooks = await Book.aggregate([
            {
                $project: {
                    issued: {
                        $subtract: ["$quantity", "$available"]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$issued"
                    }
                }
            }
        ]);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const returnedToday = await Issue.countDocuments({
            status: "Returned",
            returnDate: {
                $gte: today,
                $lt: tomorrow
            }
        });

        const students = await Issue.distinct("studentId");

        res.status(200).json({
            success: true,
            data: {
                totalBooks,
                availableBooks: availableBooks.length ? availableBooks[0].total : 0,
                issuedBooks: issuedBooks.length ? issuedBooks[0].total : 0,
                returnedToday,
                totalStudents: students.length
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    getDashboard
};