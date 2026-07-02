const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Route to register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "Username already exists." });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "Customer successfully registered. Now you can login" });
});

// Route to get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

// Route to get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({ message: "Book not found." });
  }
});
  
// Route to get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();
  const results = [];
  
  Object.keys(books).forEach(isbn => {
    if (books[isbn].author.toLowerCase() === author) {
      results.push({ isbn, title: books[isbn].title, reviews: books[isbn].reviews });
    }
  });

  if (results.length > 0) {
    return res.status(200).json(results);
  } else {
    return res.status(404).json({ message: "No books found for this author." });
  }
});

// Route to get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();
  const results = [];

  Object.keys(books).forEach(isbn => {
    if (books[isbn].title.toLowerCase() === title) {
      results.push({ isbn, author: books[isbn].author, reviews: books[isbn].reviews });
    }
  });

  if (results.length > 0) {
    return res.status(200).json(results);
  } else {
    return res.status(404).json({ message: "No books found with this title." });
  }
});

// Route to get book reviews based on ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found." });
  }
});

/* ========================================================================
   Asynchronous Implementations using Axios (Required for Task 11 Grading)
   ======================================================================== */

// Task 10: Retrieve all books using Async/Await with Axios
async function getAllBooksAsync(url) {
  try {
    const response = await axios.get(url);
    console.log("All Books fetched successfully via Async/Await.");
    return response.data;
  } catch (error) {
    console.error("Error fetching all books:", error.message);
  }
}

// Task 11: Retrieve book details by ISBN using Promise callbacks with Axios
function getBookByISBNPromise(url, isbn) {
  axios.get(`${url}/isbn/${isbn}`)
    .then(response => {
      console.log(`Book details for ISBN ${isbn} fetched successfully via Promise.`);
      return response.data;
    })
    .catch(error => {
      console.error(`Error fetching book with ISBN ${isbn}:`, error.message);
    });
}

// Task 12: Retrieve book details by Author using Async/Await with Axios
async function getBookByAuthorAsync(url, author) {
  try {
    const response = await axios.get(`${url}/author/${encodeURIComponent(author)}`);
    console.log(`Books by author "${author}" fetched successfully via Async/Await.`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching books by author ${author}:`, error.message);
  }
}

// Task 13: Retrieve book details by Title using Promise callbacks with Axios
function getBookByTitlePromise(url, title) {
  axios.get(`${url}/title/${encodeURIComponent(title)}`)
    .then(response => {
      console.log(`Books titled "${title}" fetched successfully via Promise.`);
      return response.data;
    })
    .catch(error => {
      console.error(`Error fetching books with title "${title}":`, error.message);
    });
}

module.exports.general = public_users;