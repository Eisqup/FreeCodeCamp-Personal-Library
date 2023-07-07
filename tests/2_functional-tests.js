/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

    /*
    * ----[EXAMPLE TEST]----
    * Each test should completely test the response of the API end-point including response status code!
    */
    test('#example Test GET /api/books', function(done) {
        chai.request(server)
            .get('/api/books')
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.isArray(res.body, 'response should be an array');
                assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
                assert.property(res.body[0], 'title', 'Books in array should contain title');
                assert.property(res.body[0], '_id', 'Books in array should contain _id');
                done();
            });
    });
    /*
    * ----[END of EXAMPLE TEST]----
    */

    suite('Routing tests', function() {

        const space = () => { console.log("\n") }
        const newBook = { title: "test" }
        space()

        suite('POST /api/books with title => create book object/expect book object', function() {

            test('Test POST /api/books with title', function(done) {
                chai.request(server)
                    .post('/api/books')
                    .send(newBook)
                    .end((err, res) => {

                        assert.isNull(err)
                        assert.equal(res.status, 200);

                        assert.property(res.body, '_id', 'res.body has _id')
                        assert.strictEqual(res.body.title, newBook.title)

                        done()
                    })
            });

            test('Test POST /api/books with no title given', function(done) {

                chai.request(server)
                    .post('/api/books')
                    .send({})
                    .end((err, res) => {

                        assert.isNull(err)
                        assert.equal(res.status, 200);

                        assert.strictEqual(res.text, "missing required field title")

                        done()
                    })
            });

        });

        space()
        suite('GET /api/books => array of books', function() {

            test('Test GET /api/books', function(done) {
                chai.request(server)
                    .post('/api/books')
                    .send(newBook)
                    .then((res) => {
                        assert.equal(res.status, 200);
                        return chai.request(server)
                            .get('/api/books')
                    }).then((res) => {
                        assert.equal(res.status, 200);

                        assert.isArray(res.body)
                        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
                        assert.property(res.body[0], 'title', 'Books in array should contain title');
                        assert.property(res.body[0], '_id', 'Books in array should contain _id');
                        assert.property(res.body[0], 'comments', 'Books in array should contain comments');

                        done()
                    }).catch((err) => {
                        assert.isNull(err)
                        done(err)
                    })
            });

        });

        space();
        suite('GET /api/books/[id] => book object with [id]', function() {

            test('Test GET /api/books/[id] with id not in db', function(done) {
                chai.request(server)
                    .get('/api/books/5555')
                    .end((err, res) => {
                        console.log(res.text)
                        assert.isNull(err)
                        assert.equal(res.status, 200);

                        assert.strictEqual(res.text, "no book exists")

                        done()
                    })
            });

            test('Test GET /api/books/[id] with valid id in db', function(done) {
                chai.request(server)
                    .post('/api/books')
                    .send(newBook)
                    .end((err, res) => {
                        assert.isNull(err);
                        assert.equal(res.status, 200);
                        chai.request(server)
                            .get(`/api/books/${res.body._id}`)
                            .end((err, response) => {
                                assert.isNull(err);
                                assert.equal(res.status, 200);

                                assert.strictEqual(response._id, res._id)
                                done()
                            })
                    })
            });

        });


        space();
        suite('POST /api/books/[id] => add comment/expect book object with id', function() {

            const newComment = { comment: "hello" }

            test('Test POST /api/books/[id] with comment', function(done) {
                chai.request(server)
                    .post('/api/books')
                    .send(newBook)
                    .end((err, res) => {
                        assert.isNull(err);
                        assert.equal(res.status, 200);

                        chai.request(server)
                            .post(`/api/books/${res.body._id}`)
                            .send(newComment)
                            .end((err, response) => {
                                assert.isNull(err);
                                assert.equal(response.status, 200);

                                assert.strictEqual(response.body._id, res.body._id)
                                assert.include(response.body.comments, newComment.comment);

                                done()
                            })

                    })
            });

            test('Test POST /api/books/[id] without comment field', function(done) {
               chai.request(server)
                    .post('/api/books')
                    .send(newBook)
                    .end((err, res) => {
                        assert.isNull(err);
                        assert.equal(res.status, 200);

                        chai.request(server)
                            .post(`/api/books/${res.body._id}`)
                            .send({})
                            .end((err, response) => {
                                assert.isNull(err);
                                assert.equal(response.status, 200);

                                assert.strictEqual(response.text, "missing required field comment")

                                done()
                            })

                    })
            });

            test('Test POST /api/books/[id] with comment, id not in db', function(done) {
                chai.request(server)
                    .post('/api/books')
                    .send(newBook)
                    .end((err, res) => {
                        assert.isNull(err);
                        assert.equal(res.status, 200);

                        chai.request(server)
                            .post(`/api/books/6666`)
                            .send(newComment)
                            .end((err, response) => {
                                assert.isNull(err);
                                assert.equal(response.status, 200);

                                assert.strictEqual(response.text, "no book exists")

                                done()
                            })

                    })
            });

        });
        space();
        suite('DELETE /api/books/[id] => delete book object id', function() {

            test('Test DELETE /api/books/[id] with valid id in db', function(done) {
                chai.request(server)
                    .post('/api/books')
                    .send(newBook)
                    .end((err, res) => {
                        assert.isNull(err);
                        assert.equal(res.status, 200);

                        chai.request(server)
                            .delete(`/api/books/${res.body._id}`)
                            .end((err, response) => {
                                assert.isNull(err);
                                assert.equal(response.status, 200);

                                assert.strictEqual(response.text, "delete successful")

                                done()
                            })

                    })
            });

            test('Test DELETE /api/books/[id] with  id not in db', function(done) {
                chai.request(server)
                    .post('/api/books')
                    .send(newBook)
                    .end((err, res) => {
                        assert.isNull(err);
                        assert.equal(res.status, 200);

                        chai.request(server)
                            .delete(`/api/books/12345`)
                            .end((err, response) => {
                                assert.isNull(err);
                                assert.equal(response.status, 200);

                                assert.strictEqual(response.text, "no book exists")

                                done()
                            })

                    })
            });

        });

    });

});
