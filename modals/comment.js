let mongoose = require('mongoose')
let Book = require('../modals/book')
let Schema = mongoose.Schema

let commentSchema = new Schema(
  {
    content: { type: String, required: true },
    bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    likes: { type: Number, default: 0 },
    // dislike: { type: Number },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Comment', commentSchema)
