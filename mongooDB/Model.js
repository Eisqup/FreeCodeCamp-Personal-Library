const { Schema } = require('mongoose');
const mongoose = require('mongoose')

const BookShema = new Schema({
    _id: { type: String, required: true },
    title: { type: String, required: true },
    comments: { type:[], required: true },
    commentcount: {type:Number, default: function () {
      return this.comments.length;
    }}
});

const BookModel = mongoose.model('Book', BookShema);

module.exports = BookModel
