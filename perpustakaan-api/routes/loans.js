const express = require("express");
const router = express.Router();
const Loan = require("../models/loan");
const amqplib = require("amqplib");
const Book = require('../models/book'); 
const { loanLimiter } = require("../middleware/ratelimiters");

router.use(loanLimiter);

// CREATE (POST /api/loans) — Pinjam
router.post("/", async (req, res) => {
  try {
    // Buat pinjaman
    const loan = new Loan({ 
      ...req.body, 
      borrowDate: new Date(), 
      status: "dipinjam" 
    });

    await loan.save();
    console.log("Pinjaman disimpan :", loan);

    // Cari buku berdasarkan bookId
    const book = await Book.findById(loan.bookId);
    if (!book) {
      console.error("Buku tidak ditemukan!");
      return res.status(404).json({ message: "Buku tidak ditemukan" });
    }
    console.log("Buku ditemukan :", book);

    // Publish event to RabbitMQ
    const conn = await amqplib.connect("amqp://rabbitmq");
    const channel = await conn.createChannel();

    const queue = "perpustakaan.sensors";
    await channel.assertQueue(queue, { durable: true });

    const message = {
      event: `Buku dipinjam: ${book?.title}`,
      bookId: loan.bookId,
      userId: loan.userId,
      time: new Date()
    };
    console.log("Event diterbitkan :", message);
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));

    await channel.close();
    await conn.close();

    res.status(201).json(loan);
  } catch (err) {
    console.error("Gagal menyimpan pinjaman!", err);
    res.status(500).json({ error: "Gagal menyimpan pinjaman!", details: err?.message });
  }
});

// READ all
router.get('/', async (req, res) => {
  const loans = await Loan.find().populate('userId bookId');
  res.json(loans);
});

// UPDATE (PUT /api/loans/:id) — Pengembalian
router.put("/:id", async (req, res) => {
  try {
    const updated = await Loan.findByIdAndUpdate(
      req.params.id,
      { returnDate: new Date(), status: "dikembalikan" },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Peminjaman tidak ditemukan" });

    const book = await Book.findById(updated.bookId);

    // Publish event to RabbitMQ
    const conn = await amqplib.connect("amqp://rabbitmq");
    const channel = await conn.createChannel();

    const queue = "perpustakaan.sensors";
    await channel.assertQueue(queue, { durable: true });

    const message = {
      event: `Buku dikembalikan: ${book?.title}`,
      bookId: updated.bookId,
      userId: updated.userId,
      time: new Date()
    };
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    console.log("Event diterbitkan :", message);

    await channel.close();
    await conn.close();

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengupdate pinjaman!", details: err });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Loan.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: "Gagal menghapus pinjaman!", details: err });
  }
});

module.exports = router;
