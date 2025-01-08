import express from 'express';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();

const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.send('Working...');
});

app.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
});
