const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  return users.some(user => user.username === username);
}

const authenticatedUser = (username, password)=>{ 
  return users.some(user => user.username === username && user.password === password);
}

// Task 8: Login registered user
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (authenticatedUser(username, password)) {
    // Generate a JWT access token valid for 1 hour
    let accessToken = jwt.sign({ username: username }, 'access_secret_key', { expiresIn: '1h' });
    
    // Store authentication details in session
    req.session.authorization = {
      accessToken, username
    };

    return res.status(200).json({
      message: "Customer successfully logged in",
      token: accessToken
    });
  } else {
    return res.status(401).json({ message: "Invalid Login. Check username and password" });
  }
});

// Task 9: Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  
  // Extract username from session or request user context
  const username = req.session?.authorization?.username || req.user?.username;

  if (!username) {
    return res.status(403).json({ message: "User not authenticated." });
  }

  if (!review) {
    return res.status(400).json({ message: "Review content is required." });
  }

  if (books[isbn]) {
    // Add or overwrite review for the specific user
    books[isbn].reviews[username] = review;
    return res.status(200).json({
      message: "Review successfully added/updated.",
      reviews: books[isbn].reviews
    });
  } else {
    return res.status(404).json({ message: "Book not found." });
  }
});

// Task 10: Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session?.authorization?.username || req.user?.username;

  if (!username) {
    return res.status(403).json({ message: "User not authenticated." });
  }

  if (books[isbn]) {
    if (books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).json({
        message: `Review for ISBN ${isbn} posted by user ${username} deleted successfully.`
      });
    } else {
      return res.status(404).json({ message: "No review found from this user to delete." });
    }
  } else {
    return res.status(404).json({ message: "Book not found." });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;