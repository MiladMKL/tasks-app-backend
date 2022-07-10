const tasksRouter = require('express').Router()
const jwt = require('jsonwebtoken')

const Task = require('../models/task')
const User = require('../models/user')


/** This file handles routing */

const getTokenFrom = request => {
  const authorizationHeader = request.get('authorization')
  console.log('authorizationHeader:', authorizationHeader)
  if (authorizationHeader && authorizationHeader.toLowerCase().startsWith('bearer ')) {
    return authorizationHeader.substring(7)
  }
  return null
}

tasksRouter.get('/', async (request, response) => {
  const tasks = await Task
    .find({})
    .populate('user', { username: 1, name: 1 })

  response.json(tasks)
})

tasksRouter.get('/:id', async (request, response) => {
  const task = await Task.findById(request.params.id)

  if (task) {
    response.json(task.toJSON())
  } else {
    response.status(404).end()
  }
})

tasksRouter.post('/', async (request, response) => {
  const { title, completed } = request.body
  console.log('Request-Body:', request.body)
  const token = getTokenFrom(request)
  console.log('token:', token)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  console.log('decodedToken:', decodedToken)

  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const newTask = new Task({
    title: title,
    completed: completed,
    date: new Date(),
    user: user._id
  })

  const savedTask = await newTask.save()
  user.tasks = user.tasks.concat(savedTask._id)
  await user.save()

  response.status(201).json(savedTask)
})

tasksRouter.delete('/:id', async (request, response) => {
  await Task.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

tasksRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const task = {
    title: body.title,
    completed: body.completed
  }

  Task.findByIdAndUpdate(request.params.id, task, { new: true })
    .then(updatedTask => {
      response.json(updatedTask)
    })
    .catch(error => next(error))
})

module.exports = tasksRouter