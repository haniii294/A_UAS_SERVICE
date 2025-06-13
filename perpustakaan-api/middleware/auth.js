const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader?.split(' ')[1]; // Format: "Bearer <token>"

  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // bisa akses req.user.userId nanti kalau perlu
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
