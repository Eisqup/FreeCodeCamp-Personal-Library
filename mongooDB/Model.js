const { Schema } = require('mongoose');
const mongoose = require('mongoose')

const BookIssueShema = new Schema({
    _id: { type: String, required: true },
    title: { type: String, required: true },
});

const BookModel = mongoose.model('Book', IssueShema);

module.exports = BookModel
