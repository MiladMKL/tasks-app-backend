const tasksRouter = require('express').Router()
const Task = require('../models/task')

/** This file handles routing */

tasksRouter.get('/', (request, response) => {
  Task.find({}).then(tasks => {
    response.json(tasks)
  })
})

tasksRouter.get('/:id', (request, response, next) => {
  Task.findById(request.params.id)
    .then(task => {
      if (task) {
        response.json(task)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

tasksRouter.post('/', (request, response, next) => {
  const body = request.body

  if (body.title === undefined) {
    return response.status(400).json({ error: 'title is required' })
  }

  const task = new Task({
    title: body.title,
    date: new Date(),
    completed: body.completed || false
  })

  task.save()
    .then(savedTask => {
      response.json(savedTask)
    })
    .catch(error => next(error))
})

tasksRouter.delete('/:id', (request, response, next) => {
  Task.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
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