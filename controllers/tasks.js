const tasksRouter = require('express').Router()
const Task = require('../models/task')

/** This file handles routing */

tasksRouter.get('/', async (request, response) => {
  const tasks = await Task.find({})
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
  const body = request.body

  /*
  if (body.title === undefined) {
    return response.status(400).json({ error: 'title is required' })
  }
  */

  const newTask = new Task({
    title: body.title,
    date: new Date(),
    completed: body.completed || false
  })

  const savedTask = await newTask.save()
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