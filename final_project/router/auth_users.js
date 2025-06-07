const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
 const isUserExist = users.filter(user => user.username === username);
  if (isUserExist.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  const foundUser = users.filter(user => user.username === username && user.password === password);
  if (foundUser.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.query;
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  if (authenticatedUser(username, password)) {
    // Generate an access token
    const accessToken = jwt.sign({ username }, 'fingerprint_customer', { expiresIn: '1h' });
    req.session.authorization = { accessToken, username };
    return res.status(200).json({message: "User logged in successfully", accessToken});
  } else {
    return res.status(401).json({message: "Invalid username or password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // Write yo
    const isbn = req.params.isbn;
  const { queryReview } = req.query;
  if (books[isbn]) {
    if (Object.keys(books[isbn].reviews).length > 0) {
      Object.values(books[isbn].reviews).filter(review => review.username === req.session.authorization.username).forEach(foundReview => {
        if(foundReview){
          foundReview.review = queryReview;
          console.log("Review Updated successfully", foundReview);
          return res.status(200).json({message: `Book ${isbn} Review updated successfull`});
        }else {
          books[isbn].reviews[req.session.authorization.username] = { username: req.session.authorization.username, review: queryReview };
          console.log("Review added successfully",books[isbn].reviews[req.session.authorization.username]);
          return res.status(200).json({message: `Book ${isbn} Review added successfull`});
        }
      });
    }else{
      books[isbn].reviews[req.session.authorization.username] = { username: req.session.authorization.username, review: queryReview };
      return res.status(200).json({message: `Book ${isbn} Review added successfull`});
    }
      
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

// delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    if (Object.keys(books[isbn].reviews).length > 0) {
      if (books[isbn].reviews[req.session.authorization.username]) {
        delete books[isbn].reviews[req.session.authorization.username];
        console.log("Review deleted successfully");
        return res.status(200).json({message: `Book ${isbn} Review deleted successfully`});
      } else {
        return res.status(404).json({message: "Review not found for this user"});
      }
    } else {
      return res.status(404).json({message: "No reviews found for this book"});
    }
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
