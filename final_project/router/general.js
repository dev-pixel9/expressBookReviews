const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

/**
 * Route to register a new customer account.
 * @route POST /register
 */
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

/**
 * Task 1: Get the complete list of available books in the shop.
 * @route GET /
 */
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

/**
 * Task 2: Retrieve detailed book records matching a specific ISBN.
 * @route GET /isbn/:isbn
 */
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({ message: "Book not found." });
  }
});
  
/**
 * Task 3: Retrieve book details categorized by author name.
 * @route GET /author/:author
 */
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

/**
 * Task 4: Search and find book data matching a specific book title.
 * @route GET /title/:title
 */
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();
  const results = [];

  Object.keys(books).forEach(isbn => {
    if (books[isbn].title.toLowerCase() === title) {
      results.push({ isbn, title: books[isbn].title, author: books[isbn].author, reviews: books[isbn].reviews });
    }
  });

  if (results.length > 0) {
    return res.status(200).json(results);
  } else {
    return res.status(404).json({ message: "No books found with this title." });
  }
});

/**
 * Task 5: View all public user reviews left for a specific ISBN.
 * @route GET /review/:isbn
 */
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

/**
 * Task 10: Asynchronously retrieves all books using Async/Await with Axios.
 * @param {string} url - The base endpoint URL of the API server.
 * @returns {Promise<object>} The list of all books from the server.
 */
async function getAllBooksAsync(url) {
  try {
    const response = await axios.get(url);
    if (!response.data) {
      throw new Error("Empty response received from the server resource context.");
    }
    console.log("All Books data collection successfully fetched via Async/Await.");
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch all books async block execution: ${error.message}`);
    throw error;
  }
}

/**
 * Task 11: Asynchronously retrieves book details matching an ISBN using Promise callbacks.
 * @param {string} url - The base endpoint URL of the API server.
 * @param {string} isbn - The unique target ISBN identifier.
 * @returns {void} Logs out target structural JSON components.
 */
function getBookByISBNPromise(url, isbn) {
  if (!isbn) {
    console.error("Invalid state execution: Missing necessary ISBN argument context.");
    return;
  }
  axios.get(`${url}/isbn/${isbn}`)
    .then(response => {
      if (!response.data) {
        throw new Error(`Data body not present for target record identifier: ${isbn}`);
      }
      console.log(`Book details for ISBN ${isbn} successfully fetched via clean Promise resolving.`);
    })
    .catch(error => {
      console.error(`Failed to isolate book by ISBN via Promise lifecycle execution: ${error.message}`);
    });
}

/**
 * Task 12: Asynchronously search and fetch book details by Author using Async/Await.
 * @param {string} url - The base endpoint URL of the API server.
 * @param {string} author - The specific target author name.
 * @returns {Promise<array>} Array of books matched under the target author scope.
 */
async function getBookByAuthorAsync(url, author) {
  try {
    if (!author) {
      throw new Error("Author string parameter context must be provided.");
    }
    const response = await axios.get(`${url}/author/${encodeURIComponent(author)}`);
    console.log(`Books for Author context "${author}" successfully resolved via Async/Await wrapper.`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch author specific data during async execution scope: ${error.message}`);
    throw error;
  }
}

/**
 * Task 13: Asynchronously searches book records by Title using explicit Promise resolution chaining.
 * @param {string} url - The base endpoint URL of the API server.
 * @param {string} title - The specific target book title.
 * @returns {void} Logs execution success context.
 */
function getBookByTitlePromise(url, title) {
  if (!title) {
    console.error("Missing critical parameter: Title string context required.");
    return;
  }
  axios.get(`${url}/title/${encodeURIComponent(title)}`)
    .then(response => {
      if (!response.data) {
        throw new Error(`Empty target response collection context for: ${title}`);
      }
      console.log(`Books categorized under Title context "${title}" successfully resolved.`);
    })
    .catch(error => {
      console.error(`Failed to fetch book title details within Promise scope handler: ${error.message}`);
    });
}

module.exports.general = public_users;