/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const bookModel = require('../mongooDB/Model')

module.exports = function(app, myDB) {

    app.route('/api/books')
        .get(function(req, res) {
            //response will be array of book objects
            //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]

            myDB.find().toArray()
  .then(response => {
    res.json(response);
  })
  .catch(error => {
    console.error('Error retrieving documents:', error);
  });
        })

        .post(function(req, res) {
            //response will contain new book object including atleast _id and title
            let title = req.body.title;

            if (!title) {
                res.send("missing required field title")
                return
            }

            const newBook = new bookModel({ title: title })

            myDB.insertOne(newBook)
                .then(response => {
                    res.send({ _id: response.insertedId, title: title })
                })
        })

        .delete(function(req, res) {
            //if successful response will be 'complete delete successful'
            myDB.deleteMany({}).then(response => {
                if (response.deletedCount > 0) {
                    res.send("complete delete successful")
                }

            })
        });



    app.route('/api/books/:id')
        .get(function(req, res) {
            let bookid = req.params.id;
            //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
            myDB.findOne({_id:bookid}).then(response =>{
                res.send(response)
            })
        })

        .post(function(req, res) {
            let bookid = req.params.id;
            let comment = req.body.comment;
            //json res format same as .get
            myDB.findOneAndUpdate({_id:bookid},
                                  { $push:{comments:comment},$inc: { commentcount: 1 }},
                                { returnDocument: "after"})
                .then(response=>{
                res.send(response.value)
            })
            
        })

        .delete(function(req, res) {
            let bookid = req.params.id;
            //if successful response will be 'delete successful'
            myDB.deleteOne({_id:bookid}).then(response => {
                if (response.deletedCount = 1) {
                    res.send("delete successful")
                }

            })
        });

};
