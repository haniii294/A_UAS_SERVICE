const amqplib = require("amqplib");
const connectDB = require("./db");
const Movement = require("./movement.model");

(async () => {
  await connectDB();

  const conn = await amqplib.connect("amqp://rabbitmq");
  const channel = await conn.createChannel();

  const queue = "perpustakaan.sensors";
  await channel.assertQueue(queue, { durable: true });

   console.log("IoT Consumer dimulai.");

  channel.consume(queue, async (msg) => {
    const data = JSON.parse(msg.content.toString());
  
    // Kirim ke API
    try {
      await fetch("http://perpustakaan-api:5000/api/movements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.error("Gagal mengirim ke API!", err);
    }
    channel.ack(msg);
  });
})();
