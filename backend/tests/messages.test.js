const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const Message = require('../models/Message');

describe('Message API', () => {
  let user1, user2;

  beforeAll(async () => {
    await User.deleteMany();
    await Message.deleteMany();

    user1 = new User({ name: 'Alice', email: 'alice@example.com', password: 'password123' });
    user2 = new User({ name: 'Bob', email: 'bob@example.com', password: 'password123' });

    await user1.save();
    await user2.save();
  });

  it('should send a message', async () => {
    const res = await request(app)
      .post('/api/messages')
      .send({
        sender: user1._id,
        receiver: user2._id,
        text: 'Hello, Bob!',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('text', 'Hello, Bob!');
  });

  it('should get messages between two users', async () => {
    const res = await request(app)
      .get(`/api/messages/${user1._id}/${user2._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toHaveProperty('text', 'Hello, Bob!');
  });
});
