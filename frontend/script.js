// API Base URL
const API_URL = "http://localhost:5000/api/";

// Utility function to show messages
function showMessage(elementId, message, type = "success") {
    const messageElement = document.getElementById(elementId);
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.className = `message ${type}`;
        messageElement.style.display = "block";
        
        setTimeout(() => {
            messageElement.style.display = "none";
        }, 5000);
    }
}

// Utility function to format date
function formatDate(dateString) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}

// ==================== DASHBOARD ====================
async function loadDashboard() {
    try {
        const response = await fetch(`${API_URL}/api/dashboard/`);
        const result = await response.json();
        
        if (result.success) {
            const data = result.data;
            document.getElementById("totalBooks").textContent = data.totalBooks;
            document.getElementById("availableBooks").textContent = data.availableBooks;
            document.getElementById("issuedBooks").textContent = data.issuedBooks;
            document.getElementById("returnedBooks").textContent = data.returnedToday;
            
            // Load recent books
            await loadRecentBooks();
        }
    } catch (error) {
        console.error("Error loading dashboard:", error);
    }
}

async function loadRecentBooks() {
    try {
        const response = await fetch(`${API_URL}/api/books/?limit=5`);
        const result = await response.json();
        
        if (result.success) {
            const tableBody = document.getElementById("recentBooksTable");
            if (tableBody) {
                tableBody.innerHTML = result.data.map(book => `
                    <tr>
                        <td>${book.title}</td>
                        <td>${book.author}</td>
                        <td>${book.category}</td>
                        <td>
                            <span class="badge ${book.available > 0 ? 'badge-success' : 'badge-danger'}">
                                ${book.available > 0 ? 'Available' : 'Out of Stock'}
                            </span>
                        </td>
                    </tr>
                `).join("");
            }
        }
    } catch (error) {
        console.error("Error loading recent books:", error);
    }
}

// ==================== BOOKS ====================
let allBooks = [];
let currentSearch = "";

async function loadBooks(search = "") {
    try {
        const url = search 
            ? `${API_URL}/books/?search=${encodeURIComponent(search)}`
            : `${API_URL}/books/`;
        
        const response = await fetch(url);
        const result = await response.json();
        
        if (result.success) {
            allBooks = result.data;
            displayBooks(allBooks);
        }
    } catch (error) {
        console.error("Error loading books:", error);
        showMessage("message", "Error loading books", "error");
    }
}

function displayBooks(books) {
    const tableBody = document.getElementById("booksTable");
    if (!tableBody) return;
    
    if (books.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 40px;">
                    No books found
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = books.map(book => `
        <tr>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td>${book.category}</td>
            <td>${book.quantity}</td>
            <td>${book.available}</td>
            <td>
                <span class="badge ${book.available > 0 ? 'badge-success' : 'badge-danger'}">
                    ${book.available > 0 ? 'Available' : 'Out of Stock'}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editBook('${book._id}')">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteBook('${book._id}')">Delete</button>
            </td>
        </tr>
    `).join("");
}

async function searchBooks() {
    const searchInput = document.getElementById("searchBook");
    if (searchInput) {
        currentSearch = searchInput.value.trim();
        await loadBooks(currentSearch);
    }
}

function refreshBooks() {
    const searchInput = document.getElementById("searchBook");
    if (searchInput) {
        searchInput.value = "";
    }
    currentSearch = "";
    loadBooks();
}

async function editBook(bookId) {
    try {
        const response = await fetch(`${API_URL}/api/books/${bookId}`);
        const result = await response.json();
        
        if (result.success) {
            const book = result.data;
            // Store book data in localStorage for edit page
            localStorage.setItem("editBookId", bookId);
            localStorage.setItem("editBookData", JSON.stringify(book));
            window.location.href = "add-book.html?edit=true";
        }
    } catch (error) {
        console.error("Error fetching book:", error);
        showMessage("message", "Error loading book details", "error");
    }
}

async function deleteBook(bookId) {
    if (!confirm("Are you sure you want to delete this book?")) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/api/books/${bookId}`, {
            method: "DELETE"
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage("message", "Book deleted successfully", "success");
            loadBooks(currentSearch);
        } else {
            showMessage("message", result.message || "Error deleting book", "error");
        }
    } catch (error) {
        console.error("Error deleting book:", error);
        showMessage("message", "Error deleting book", "error");
    }
}

// ==================== ADD/EDIT BOOK ====================
async function loadBookForEdit() {
    const editBookId = localStorage.getItem("editBookId");
    const editBookData = localStorage.getItem("editBookData");
    
    if (editBookId && editBookData && window.location.search.includes("edit=true")) {
        const book = JSON.parse(editBookData);
        const form = document.getElementById("addBookForm");
        
        if (form) {
            form.title.value = book.title || "";
            form.author.value = book.author || "";
            form.isbn.value = book.isbn || "";
            form.category.value = book.category || "";
            form.year.value = book.year || "";
            form.quantity.value = book.quantity || "";
            form.available.value = book.available || "";
            
            // Change button text
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.textContent = "Update Book";
            }
            
            // Add hidden input for book ID
            const hiddenInput = document.createElement("input");
            hiddenInput.type = "hidden";
            hiddenInput.name = "bookId";
            hiddenInput.id = "bookId";
            hiddenInput.value = editBookId;
            form.appendChild(hiddenInput);
        }
    }
}

async function handleAddBook(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const bookId = document.getElementById("bookId")?.value;
    
    const data = {
        title: formData.get("title"),
        author: formData.get("author"),
        isbn: formData.get("isbn"),
        category: formData.get("category"),
        year: parseInt(formData.get("year")),
        quantity: parseInt(formData.get("quantity")),
        available: parseInt(formData.get("available"))
    };
    
    try {
        const url = bookId ? `${API_URL}/books/${bookId}` : `${API_URL}/books/`;
        const method = bookId ? "PUT" : "POST";
        
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage("message", result.message, "success");
            form.reset();
            
            // Clear edit data
            localStorage.removeItem("editBookId");
            localStorage.removeItem("editBookData");
            
            // Redirect to books page after 1 second
            setTimeout(() => {
                window.location.href = "books.html";
            }, 1000);
        } else {
            showMessage("message", result.message || "Error saving book", "error");
        }
    } catch (error) {
        console.error("Error saving book:", error);
        showMessage("message", "Error saving book", "error");
    }
}

// ==================== ISSUE BOOK ====================
async function handleIssueBook(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    const data = {
        bookTitle: formData.get("bookTitle"),
        studentName: formData.get("studentName"),
        studentId: formData.get("studentId"),
        issueDate: formData.get("issueDate")
    };
    
    try {
        const response = await fetch(`${API_URL}/api/issues`, {method: "POST",headers: {"Content-Type": "application/json"},body: JSON.stringify(data)});
        const result = await response.json();
    
        if (result.success) {
            showMessage("message", result.message, "success");
            form.reset();
        } else {
            showMessage("message", result.message || "Error issuing book", "error");
        }
    } catch (error) {
        console.error("Error issuing book:", error);
        showMessage("message", "Error issuing book", "error");
    }
}

// ==================== RETURN BOOK ====================
async function handleReturnBook(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    const issueId = formData.get("issueId");
    
    try {
        const response = await fetch(`${API_URL}/api/issue/return/${issueId}`, {
            method: "PUT"
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage("message", result.message, "success");
            form.reset();
        } else {
            showMessage("message", result.message || "Error returning book", "error");
        }
    } catch (error) {
        console.error("Error returning book:", error);
        showMessage("message", "Error returning book", "error");
    }
}

// ==================== EVENT LISTENERS ====================
document.addEventListener("DOMContentLoaded", function() {
    const currentPage = window.location.pathname.split("/").pop();
    
    // Dashboard page
    if (currentPage === "dashboard.html" || currentPage === "") {
        loadDashboard();
    }
    
    // Books page
    if (currentPage === "books.html") {
        loadBooks();
        
        const searchBtn = document.getElementById("searchBtn");
        const searchInput = document.getElementById("searchBook");
        const refreshBtn = document.getElementById("refreshBooks");
        
        if (searchBtn) {
            searchBtn.addEventListener("click", searchBooks);
        }
        
        if (searchInput) {
            searchInput.addEventListener("keypress", function(e) {
                if (e.key === "Enter") {
                    searchBooks();
                }
            });
        }
        
        if (refreshBtn) {
            refreshBtn.addEventListener("click", refreshBooks);
        }
    }
    
    // Add/Edit Book page
    if (currentPage === "add-book.html") {
        loadBookForEdit();
        
        const addBookForm = document.getElementById("addBookForm");
        if (addBookForm) {
            addBookForm.addEventListener("submit", handleAddBook);
        }
    }
    
    // Issue Book page
    if (currentPage === "issue-book.html") {
        const issueBookForm = document.getElementById("issueBookForm");
        if (issueBookForm) {
            issueBookForm.addEventListener("submit", handleIssueBook);
        }
    }
    
    // Return Book page
    if (currentPage === "return-book.html") {
        const returnBookForm = document.getElementById("returnBookForm");
        if (returnBookForm) {
            returnBookForm.addEventListener("submit", handleReturnBook);
        }
    }
});