const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const auth = require('../middleware/auth'); // Middleware JWT

const { bookLimiter } = require('../middleware/ratelimiters');

router.use(bookLimiter);
// CREATE (Hanya user login yang bisa menambahkan buku)
router.post("/", auth, async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();

    const conn = await amqplib.connect("amqp://rabbitmq");
    const channel = await conn.createChannel();

    const queue = "perpustakaan.sensors";
    await channel.assertQueue(queue, { durable: true });

    const message = {
      event: `Buku ditambah: ${book.title}`,
      bookId: book._id,
      time: new Date()
    };
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    console.log("Event diterbitkan :", message);

    await channel.close();
    await conn.close();

    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: "Gagal menambah buku!", details: err });
  }
});


// READ all (Public)
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ one (Public)
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE (Hanya user login yang bisa update buku)
router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE (Hanya user login yang bisa hapus buku)
router.delete('/:id', auth, async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
