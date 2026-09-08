// API Base URL
const API_URL = window.location.origin + "/api/";

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
        const response = await fetch(`${API_URL}dashboard/`);
        const result = await response.json();
        
        if (result.success) {
            const data = result.data;
            document.getElementById("totalBooks").textContent = data.totalBooks;
            document.getElementById("availableBooks").textContent = data.availableBooks;
            document.getElementById("issuedBooks").textContent = data.issuedBooks;
            document.getElementById("returnedBooks").textContent = data.returnedToday;
            
            // Render SVG stats chart
            renderLibraryStatsChart(data);

            // Load recent books
            await loadRecentBooks();
        }
    } catch (error) {
        console.error("Error loading dashboard:", error);
    }
}

function renderLibraryStatsChart(data) {
    const svg = document.getElementById("libraryStatsChart");
    if (!svg) return;
    
    svg.setAttribute("viewBox", "0 0 600 220");
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    
    const available = data.availableBooks || 0;
    const issued = data.issuedBooks || 0;
    const total = data.totalBooks || 1;
    
    const maxVal = Math.max(total, available, issued, 10);
    const scale = 150 / maxVal;
    
    const hAvailable = available * scale;
    const hIssued = issued * scale;
    const hTotal = total * scale;
    
    svg.innerHTML = `
        <defs>
            <linearGradient id="gradPrimary" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.85"/>
                <stop offset="100%" stop-color="#2563eb" stop-opacity="0.15"/>
            </linearGradient>
            <linearGradient id="gradSecondary" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.85"/>
                <stop offset="100%" stop-color="#7c3aed" stop-opacity="0.15"/>
            </linearGradient>
            <linearGradient id="gradTotal" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#10b981" stop-opacity="0.85"/>
                <stop offset="100%" stop-color="#059669" stop-opacity="0.15"/>
            </linearGradient>
        </defs>
        
        <!-- Grid Lines -->
        <line x1="50" y1="30" x2="550" y2="30" stroke="rgba(255,255,255,0.06)" stroke-width="1" />
        <line x1="50" y1="80" x2="550" y2="80" stroke="rgba(255,255,255,0.06)" stroke-width="1" />
        <line x1="50" y1="130" x2="550" y2="130" stroke="rgba(255,255,255,0.06)" stroke-width="1" />
        <line x1="50" y1="180" x2="550" y2="180" stroke="rgba(255,255,255,0.15)" stroke-width="1" />
        
        <!-- Y Axis Labels -->
        <text x="35" y="184" fill="#64748b" font-size="11" font-weight="600" text-anchor="end">0</text>
        <text x="35" y="134" fill="#64748b" font-size="11" font-weight="600" text-anchor="end">${Math.round(maxVal * 0.33)}</text>
        <text x="35" y="84" fill="#64748b" font-size="11" font-weight="600" text-anchor="end">${Math.round(maxVal * 0.66)}</text>
        <text x="35" y="34" fill="#64748b" font-size="11" font-weight="600" text-anchor="end">${maxVal}</text>

        <!-- Bar 1: Total Books -->
        <rect class="chart-bar" x="120" y="${180 - hTotal}" width="50" height="${hTotal}" rx="6" fill="url(#gradTotal)" stroke="#10b981" stroke-width="1" style="transition: all 0.5s ease-out; cursor: pointer;">
            <animate attributeName="height" from="0" to="${hTotal}" dur="0.8s" fill="freeze" />
            <animate attributeName="y" from="180" to="${180 - hTotal}" dur="0.8s" fill="freeze" />
        </rect>
        <text x="145" y="${175 - hTotal}" fill="#10b981" font-size="12" font-weight="bold" text-anchor="middle">${total}</text>
        <text x="145" y="202" fill="#94a3b8" font-size="12" font-weight="600" text-anchor="middle">Total Inventory</text>

        <!-- Bar 2: Available Books -->
        <rect class="chart-bar" x="270" y="${180 - hAvailable}" width="50" height="${hAvailable}" rx="6" fill="url(#gradPrimary)" stroke="#3b82f6" stroke-width="1" style="transition: all 0.5s ease-out; cursor: pointer;">
            <animate attributeName="height" from="0" to="${hAvailable}" dur="0.8s" fill="freeze" />
            <animate attributeName="y" from="180" to="${180 - hAvailable}" dur="0.8s" fill="freeze" />
        </rect>
        <text x="295" y="${175 - hAvailable}" fill="#3b82f6" font-size="12" font-weight="bold" text-anchor="middle">${available}</text>
        <text x="295" y="202" fill="#94a3b8" font-size="12" font-weight="600" text-anchor="middle">Available</text>

        <!-- Bar 3: Issued Books -->
        <rect class="chart-bar" x="420" y="${180 - hIssued}" width="50" height="${hIssued}" rx="6" fill="url(#gradSecondary)" stroke="#8b5cf6" stroke-width="1" style="transition: all 0.5s ease-out; cursor: pointer;">
            <animate attributeName="height" from="0" to="${hIssued}" dur="0.8s" fill="freeze" />
            <animate attributeName="y" from="180" to="${180 - hIssued}" dur="0.8s" fill="freeze" />
        </rect>
        <text x="445" y="${175 - hIssued}" fill="#a78bfa" font-size="12" font-weight="bold" text-anchor="middle">${issued}</text>
        <text x="445" y="202" fill="#94a3b8" font-size="12" font-weight="600" text-anchor="middle">Currently Issued</text>
    `;
}

async function loadRecentBooks() {
    try {
        const response = await fetch(`${API_URL}books/?limit=5`);
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
            ? `${API_URL}books/?search=${encodeURIComponent(search)}`
            : `${API_URL}books/`;
        
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
async function populateIssueBookDropdown() {
    try {
        const response = await fetch(`${API_URL}books/`);
        const result = await response.json();
        
        if (result.success) {
            const select = document.getElementById("bookId");
            if (select) {
                const availableBooks = result.data.filter(b => b.available > 0);
                if (availableBooks.length === 0) {
                    select.innerHTML = '<option value="" disabled selected>No books available to issue</option>';
                    return;
                }
                select.innerHTML = '<option value="" disabled selected>Select a book...</option>' + 
                    availableBooks.map(b => `<option value="${b._id}">${b.title} (by ${b.author})</option>`).join("");
            }
        }
    } catch (error) {
        console.error("Error loading books for issue:", error);
    }
}

async function handleIssueBook(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    const data = {
        bookId: formData.get("bookId"),
        studentName: formData.get("studentName"),
        studentId: formData.get("studentId"),
        issueDate: formData.get("issueDate"),
        remarks: formData.get("remarks")
    };
    
    try {
        const response = await fetch(`${API_URL}issues`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
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
async function loadIssues() {
    try {
        const response = await fetch(`${API_URL}issues/`);
        const result = await response.json();
        
        if (result.success) {
            const tableBody = document.getElementById("issuesTable");
            if (!tableBody) return;
            
            const activeIssues = result.data.filter(issue => issue.status === "Issued");
            
            if (activeIssues.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="6" style="text-align: center; padding: 40px;">
                            No active issues found
                        </td>
                    </tr>
                `;
                return;
            }
            
            tableBody.innerHTML = activeIssues.map(issue => `
                <tr>
                    <td>${issue.studentName}</td>
                    <td>${issue.studentId}</td>
                    <td>${issue.bookTitle}</td>
                    <td>${formatDate(issue.issueDate)}</td>
                    <td>${issue.remarks || '-'}</td>
                    <td>
                        <button class="btn btn-sm btn-success" onclick="returnBookById('${issue._id}')">
                            Return
                        </button>
                    </td>
                </tr>
            `).join("");
        }
    } catch (error) {
        console.error("Error loading issues:", error);
        showMessage("message", "Error loading active issues", "error");
    }
}

async function returnBookById(issueId) {
    if (!confirm("Are you sure you want to return this book?")) return;
    
    try {
        const response = await fetch(`${API_URL}issues/return/${issueId}`, {
            method: "PUT"
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage("message", result.message, "success");
            loadIssues();
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
        populateIssueBookDropdown();
        const issueBookForm = document.getElementById("issueBookForm");
        if (issueBookForm) {
            issueBookForm.addEventListener("submit", handleIssueBook);
        }
    }
    
    // Return Book page
    if (currentPage === "return-book.html") {
        loadIssues();
    }
});