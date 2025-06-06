const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.query;
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  if (isValid(username)) {
    return res.status(400).json({message: "User already exists"});
  }else {
    users.push({ username, password }); 
    return res.status(200).json({message: "User registered successfully"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //return all books in JSON format
  return res.status(200).json(books,null, 4);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //find the book based on ISBN
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn],null, 4);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Find books by author
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());
  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor, null, 4);
  } else {
    return res.status(404).json({message: "No books found for this author"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Find books by title
  const title = req.params.title;
  const booksByTitle= Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());
  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle, null, 4);
  } else {
    return res.status(404).json({message: "No books found for this Title"});
  }
});
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Find book review by isbn
  const isbn = req.params.isbn;
  if (books[isbn]) {
    if (books[isbn].reviews && Object.keys(books[isbn].reviews).length > 0) {
      return res.status(200).json(books[isbn].reviews,null, 4);
    } else {
      return res.status(200).json({message: "No reviews available for this book"});
    }
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
