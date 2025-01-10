/* eslint-disable no-undef */
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../../app.js';
import { BookModel } from '../../models/bookModel.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.disconnect();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Create mock data before each test
beforeEach(async () => {
  await BookModel.create([
    {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      genre: 'Classic',
    },
    { title: '1984', author: 'George Orwell', genre: 'Dystopin' },
  ]);
});

// clean up any data in DB after each test
afterEach(async () => {
  await BookModel.deleteMany();
});

describe('Get /books', () => {
  it('should return all books', async () => {
    const response = await request(app).get('/api/books');

    console.log(response['_body'].data);
    expect(response.status).toBe(200); // Status code check
    expect(response['_body'].data.length).toBe(2); // Number of books check
    expect(response['_body'].data[0].title).toBe('The Great Gatsby'); // Data integrity check
  });
});

describe('Post /books', () => {
  it('should add a new book', async () => {
    const newBook = {
      title: 'Moby Dick',
      author: 'Herman Melville',
      genre: 'Adventure',
    };

    const response = await request(app).post('/api/books').send(newBook);
    console.log(response['_body'].data);

    expect(response.status).toBe(201); // Status code check
    expect(response['_body'].data.title).toBe(newBook.title); // Data integrity check

    const bookInDb = await BookModel.findOne({ title: 'Moby Dick' });
    expect(bookInDb).not.toBeNull(); // Check if saved in DB
  });
});
