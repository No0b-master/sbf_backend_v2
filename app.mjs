import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './routes/index.mjs';

const app = express();
const port = process.env.PORT || 3000;
//Stable V1
// Middleware
app.use(cors({
  origin: '*', // Replace with specific domains in production, e.g. ['https://yourdomain.com']
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API Routes
app.use('/api/v1', routes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// Global Error Handler (optional)
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
