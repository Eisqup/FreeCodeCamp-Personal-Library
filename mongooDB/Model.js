const { Schema } = require('mongoose');
const mongoose = require('mongoose')

const BookShema = new Schema({
    _id: { type: String, required: true },
    title: { type: String, required: true },
});

const BookModel = mongoose.model('Book', BookShema);

module.exports = BookModel
