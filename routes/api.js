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
                    console.error('Error find.toarray ', error);
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
                .catch(error => {
                    console.error('Error insertOne: ', error);
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
            myDB.findOne({ _id: bookid }).then(response => {
                if (!response) {
                    res.send("no book exists")
                } else {
                    res.send(response)
                }
            })
        })

        .post(function(req, res) {
            let bookid = req.params.id;
            let comment = req.body.comment;
            //json res format same as .get
            if (!comment) {
                res.send("missing required field comment")
                return
            }
            myDB.findOneAndUpdate({ _id: bookid },
                { $push: { comments: comment }, $inc: { commentcount: 1 } },
                { returnDocument: "after", projection: { commentcount: 0 } })
                .then(response => {
                    if (!response.value) {
                        res.send("no book exists")
                    } else {
                        res.send(response.value)
                    }
                })
                .catch(error => {
                    console.error('Error updating document:', error);
                    res.status(500).send('Error updating document');
                });

        })

        .delete(function(req, res) {
            let bookid = req.params.id;
            //if successful response will be 'delete successful'
            myDB.deleteOne({ _id: bookid }).then(response => {
                if (response.deletedCount === 0) {
                    res.send("no book exists")
                } else {
                    res.send("delete successful")
                }

            })
        });

};
