const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


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
    
  let getBooks  = new Promise((resolve, reject) => {
    resolve(books);
  });

  getBooks.then((booksData) => {
    if (!booksData || Object.keys(booksData).length === 0) {
      console.log("No data found");
      return res.status(404).json({message: "No data found"});
    }
    return res.status(200).json(booksData, null, 4);
  }).catch((error) => {
    return res.status(500).json({message: "Error fetching data", error: error.message});
  })
 
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //find the book based on ISBN
  const isbn = req.params.isbn;
  let getBookByIsbn  = new Promise((resolve, reject) => {
    resolve(books[isbn]);
  });

  getBookByIsbn.then((bookData) => {
    if (!bookData || Object.keys(bookData).length === 0) {
      console.log("No data found");
      return res.status(404).json({message: "Book not found"});
    }
    return res.status(200).json(bookData, null, 4);
  }).catch((error) => {
    return res.status(500).json({message: "Error fetching data", error: error.message});
  })
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Find books by author
  const author = req.params.author;
  if (!author) {
    return res.status(400).json({message: "Author name is required"});  
  }
  let getBookByAuthor  = new Promise((resolve, reject) => {
    resolve(Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase()));
  });

  getBookByAuthor.then((bookData) => {
    if (!bookData || Object.keys(bookData).length === 0) {
      console.log("No data found for this author");
      return res.status(404).json({message: "Book not found for this author"});
    }
    return res.status(200).json(bookData, null, 4);
  }).catch((error) => {
    return res.status(500).json({message: "Error fetching books", error: error.message});
  })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Find books by title
  const title = req.params.title;
  if (!title) {
    return res.status(400).json({message: "Book's title name is required"});  
  }
  let getBookByTitle  = new Promise((resolve, reject) => {
    resolve(Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase()));
  });

  getBookByTitle.then((bookData) => {
    if (!bookData || Object.keys(bookData).length === 0) {
      console.log("No data found for this title");
      return res.status(404).json({message: "No books found for this Title"});
    }
    return res.status(200).json(bookData, null, 4);
  }).catch((error) => {
    return res.status(500).json({message: "Error fetching books", error: error.message});
  })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Find book review by isbn
  const isbn = req.params.isbn;
  if (!isbn) {
    return res.status(400).json({message: "Book's isbn is required"});  
  }

  let getBookReviewByIsbn  = new Promise((resolve, reject) => {
    resolve(books[isbn].reviews);
  });

  getBookReviewByIsbn.then((bookReviewsData) => {
    if (Object.keys(bookReviewsData).length === 0) {
      console.log("No Review found for this book");
      return res.status(404).json({message: "No review found for this book"});
    }
    return res.status(200).json(bookReviewsData, null, 4);
  }).catch((error) => {
    return res.status(500).json({message: "Error fetching book's reviews", error: error.message});
  })



});

module.exports.general = public_users;
