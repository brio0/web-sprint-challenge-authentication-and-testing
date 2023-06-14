const db = require('../data/dbConfig')
const request = require('supertest')
const server = require('./server')
const User = require('./users/user-model')
const Jokes = require('./jokes/jokes-router')
const jokesData = require('./jokes/jokes-data')

const user1 = { password: 1234, username: 'john' }
const user2 = { password: '123', username: 'john' }
const user3 = { password: 12345, username: 'john' }
// Write your tests here
test('sanity', () => {
  expect(true).toBe(true)
})

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

beforeEach(async () => {
  await db("users").truncate()
})

afterAll(async () => {
  await db.destroy()
})

describe('users model register function', () => {
  describe('create user', () => {
    it("add user to db", async () => {
      let user
      await User.add(user1)
      user = await db('users')
      expect(user).toHaveLength(1)
    })
    it('inserted username and password', async () => {
      const user = await User.add(user1)
      expect(user).toMatchObject({ id: 1, ...user })
    })
  })
})

describe('users model login', () => {
  test('successful user login', async () => {
    await User.add(user1)
    await request(server).post('/api/auth/login').send(user1)
    let user = await db('users')
    expect(user).toHaveLength(1)
  })
  test('status 401 if invalid credentials entered', async () => {
    await User.add(user1)
    let res = await request(server).post('/api/auth/login').send({ username: "jack" })
    expect(res.status).toBe(401)
  })

})

describe('jokes', () => {
  it("successful jokes", async () => {
    let jokes = await Jokes.get(jokesData)
    expect(jokes).toHaveLength(3)
  })
})

