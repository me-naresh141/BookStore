let mongoose = require('mongoose')
let Schema = mongoose.Schema

let bookSchema = new Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  pages: { type: Number, required: true },
  publications: { type: String, required: true },
  bookImage: { type: String, required: true },
  category: { type: String, required: true },
  author: {
    name: { type: String, required: true },
    email: { type: String, required: true, match: /@/ },
    country: { type: String, required: true },
  },
  likes: { type: Number, default: 0 },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
})

module.exports = mongoose.model('Book', bookSchema)
