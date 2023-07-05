/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const bookModel = require('../mongooDB/Model')

module.exports = function (app, myDB) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(function (req, res){
      //response will contain new book object including atleast _id and title
      let title = req.body.title;
        
        const newBook = new bookModel({title:title})
        
        myDB.insertOne(newBook)
            .then(respone => {
                console.log(respone)
                res.send({_id: respone.insertedId, title:title})            
        })
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
  
};
