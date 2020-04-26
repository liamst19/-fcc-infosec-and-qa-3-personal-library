/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect       = require('chai').expect;
var MongoClient  = require('mongodb').MongoClient;
var ObjectId     = require('mongodb').ObjectId;
//const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

// Mongoose
var mongoose     = require('mongoose')
const Schema = mongoose.Schema;
const bookSchema = new Schema({
  title:         { type: String, required: true },
  commentcount:  { type: Number },
  comments:     [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
})
const commentSchema = new Schema({
  bookid:  { type: Schema.Types.ObjectId, ref: 'Book' },
  comment: { type: String },
  date:    { type: Date }
})
const Book = mongoose.model('Book', bookSchema);
const Comment = mongoose.model('Comment', commentSchema);

module.exports = function (app) {

  /** this project needs a db !! **/
  mongoose.set("useFindAndModify", false);
  mongoose.connect(process.env.DB);
  
  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book
        .find()
        .select('title commentcount')
        .exec((err, books) => {
        if(err){
          console.log("Error: GET /api/books", err)
          return res.status(500)
        } else {
          return res.json(books)
        }
      })
    })
    
    .post(function (req, res){
      var title = req.body.title;
      //response will contain new book object including atleast _id and title
      if(!title){
        return res.status(400).send('no title')
      }
      const book = new Book({ title });
      book.save((err, savedBook) => {
        if(err){
          console.log("Error: GET /api/books", err)
          return res.status(500)
        } else {
          return res.json({ _id: savedBook._id, title});
        }
      })
      
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      const bookid = req.params.id
      if(!bookid) return res.status(400).send('no id');
        
      // Delete Book
      /* Note:
          I don't like how this looks, as it appears that, when
          a book was successfully deleted and there was problem
          while trying to remove comments for the book and no
          comment was removed, they would be left hanging without 
          reference. Perhaps there is another way to do this, so
          that change is committed after every change is processed
          successfully.
      */
      Book.findOneAndDelete(bookid, (err) => {
        if(err){
          console.log("Error: DELETE /api/books findOneAndDelete", err)
          return res.status(500)
        } else {
          // Delete Comments
          Comment.deleteMany({ bookid }, (err) => {
            if(err){
              console.log("Error: DELETE /api/books deleteMany", err)
              return res.status(500)
            }
            else return res.status(200).send('complete delete successful')
          })
        }        
      })
    });

  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      if(!bookid) return res.status(400).send('no book id')
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Comment.find({ bookid }).select('bookid comment').
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
  
};
