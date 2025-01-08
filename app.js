import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';

import { bookRouter } from './routes/index.js';

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware to parse JSON
app.use(express.json()); // Parsing JSON payloads
app.use(bodyParser.json());

// Use CORS middleware
app.use(cors());

// connect to MongoDB
mongoose
  .connect(process.env.MONGO_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`Connected to MongoDB!`))
  .catch((err) => console.error(`Error connection to MongoDB ${err}`));

const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.send('Working...');
});

// Mount routes
app.use('/api', bookRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
});
