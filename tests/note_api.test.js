const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Task = require('../models/task')
const bcrypt = require('bcrypt')
const User = require('../models/user')



beforeEach(async () => {
  await Task.deleteMany({})
  await Task.insertMany(helper.initialTasks)
})


describe('when there is initially some tasks saved', () => {
  test('tasks are returned a json', async () => {
    await api
      .get('/api/tasks')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all tasks are returned', async () => {
    const response = await api.get('/api/tasks')

    expect(response.body).toHaveLength(helper.initialTasks.length)
  })

  test('a specific task is within the returned tasks', async () => {
    const response = await api.get('/api/tasks')

    const taskNames = response.body.map(r => r.name)
    expect(taskNames).toContain('learn HTML')
  })
})


describe('viewing a specific task', () => {
  test('a specific task can be viewed', async () => {
    const tasksAtStart = await helper.tasksInDb()

    const taskToView = tasksAtStart[0]

    const resultTask = await api
      .get(`/api/tasks/${taskToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const processedTaskToView = JSON.parse(JSON.stringify(taskToView))
    expect(resultTask.body).toEqual(processedTaskToView)
  })

  test('fails with status code 404 if task does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()
    console.log(validNonexistingId)

    await api
      .get(`/api/task/${validNonexistingId}`)
      .expect(404)
  })

  test('fails with status code 404 id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api
      .get(`/api/task/${invalidId}`)
      .expect(404)
  })
})


describe('addition of a new task', () => {
  test('succeeds with valid data', async () => {
    const newTask = {
      name: 'async/await simplifies making async calls',
      done: true,
    }

    await api
      .post('/api/tasks')
      .send(newTask)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const tasksAtEnd = await helper.tasksInDb()
    expect(tasksAtEnd).toHaveLength(helper.initialTasks.length + 1)

    const taskNames = tasksAtEnd.map(r => r.name)
    expect(taskNames).toContain('async/await simplifies making async calls')
  })

  test('fails with status code 400 if data is invalid', async () => {
    const newTask = {
      done: true
    }

    await api
      .post('/api/tasks')
      .send(newTask)
      .expect(400)

    const tasksAtEnd = await helper.tasksInDb()
    expect(tasksAtEnd).toHaveLength(helper.initialTasks.length)
  })
})


describe('deletion of a task', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const tasksAtStart = await helper.tasksInDb()
    const taskToDelete = tasksAtStart[0]

    await api
      .delete(`/api/tasks/${taskToDelete.id}`)
      .expect(204)

    const tasksAtEnd = await helper.tasksInDb()
    expect(tasksAtEnd).toHaveLength(helper.initialTasks.length - 1)

    const names = tasksAtEnd.map(r => r.name)
    expect(names).not.toContain(taskToDelete.name)
  })
})

// USER TESTS

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper status code and message if username is already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username must be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

})


afterAll(() => {
  mongoose.connection.close()
}, 100000)