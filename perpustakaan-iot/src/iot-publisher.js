const amqplib = require("amqplib");
const fetch = require("node-fetch");

(async () => {
  let books = [];

  try {
    const res = await fetch("http://perpustakaan-api:5000/api/books");
    books = await res.json();

    if (books.length === 0) {
      console.log("Tidak ada buku di database!");
      process.exit(1);
    }
  } catch (err) {
    console.error("Gagal fetch books dari API!", err);
    process.exit(1);
  }

  const conn = await amqplib.connect("amqp://rabbitmq");
  const channel = await conn.createChannel();

  const queue = "perpustakaan.sensors";
  await channel.assertQueue(queue, { durable: true });

  console.log("IoT Publisher dimulai.");

  setInterval(async () => {
    const book = books[Math.floor(Math.random() * books.length)];

    const sensorData = {
      bookId: book._id,
      movement: true,
      time: new Date(),
    };
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(sensorData)));
  }, 5000);
})();
