var express = require('express')
let multer = require('multer')
var router = express.Router()
let Book = require('../modals/book')
let Comment = require('../modals/comment')
// multer

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname)
  },
})

var upload = multer({ storage: storage })

// filter

router.get('/', (req, res, next) => {
  let obj = {}
  let { category } = req.query
  let { title } = req.query
  let { author } = req.query
  if (category) {
    obj.category = category
  } else if (title) {
    obj.title = title
  } else if (author) {
    obj.author = author
  }
  Book.find(obj, (err, allbook) => {
    if (err) return next(err)
    Book.distinct('category', (err, uniqueCategory) => {
      if (err) return next(err)
      Book.distinct('author.name', (err, uniqueAuthor) => {
        if (err) return next(err)
        Book.distinct('title', (err, uniqueTitle) => {
          res.render('bookstore', {
            allbook,
            uniqueCategory,
            uniqueAuthor,
            uniqueTitle,
          })
        })
      })
    })
  })
})

// find form
router.get('/new', function (req, res, next) {
  res.render('form')
})

// submit form
router.post('/', upload.single('bookImage'), (req, res, next) => {
  let author = {
    name: req.body.name,
    email: req.body.email,
    country: req.body.country,
  }
  req.body.author = author
  req.body.bookImage = req.file.filename

  Book.create(req.body, (err, book) => {
    if (err) return next(err)
    res.render('singalbook', { book })
  })
})

router.get('/:id', (req, res, next) => {
  let id = req.params.id
  Book.findById(id)
    .populate('comments')
    .exec((err, book) => {
      // console.log(book)
      if (err) return next(err)
      res.render('singalbook', { book })
    })
})

// like
router.get('/:id/like', (req, res, next) => {
  let id = req.params.id
  Book.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, book) => {
    if (err) return next(err)
    res.redirect('/books/' + id)
  })
})
// dislike

router.get('/:id/dislike', (req, res, next) => {
  let id = req.params.id
  Book.findById(id, (err, book) => {
    if (book.likes > 0) {
      Book.findByIdAndUpdate(id, { $inc: { likes: -1 } }, (err, book) => {
        if (err) return next(err)
        res.render('singalbook')
      })
    }
    res.redirect('/books/' + id)
  })
})

// edit  foem
router.get('/:id/edit', (req, res, next) => {
  let id = req.params.id
  Book.findById(id, (err, book) => {
    res.render('editform', { book: book })
  })
})

// update
router.post('/:id', (req, res, next) => {
  let id = req.params.id
  Book.findByIdAndUpdate(id, req.body, (err, book) => {
    if (err) return next(err)
    res.redirect('/books/' + id)
  })
})

// delete book

router.get('/:id/delete', (req, res, next) => {
  let id = req.params.id
  Book.findByIdAndDelete(id, (err, book) => {
    if (err) return next(err)
    Comment.deleteMany({ bookId: book.id }, (err, book) => {
      res.redirect('/books')
    })
  })
})

// add a comment

router.post('/:id/comments', (req, res, next) => {
  let id = req.params.id
  req.body.bookId = id
  Comment.create(req.body, (err, comment) => {
    if (err) return next(err)
    Book.findByIdAndUpdate(
      id,
      { $push: { comments: comment._id } },
      (err, book) => {
        if (err) return next(err)
        console.log(book)
        res.redirect('/books/' + id)
      },
    )
  })
})

module.exports = router
