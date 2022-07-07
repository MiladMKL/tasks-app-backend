const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const Task = require('./models/task')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

/*
---------------------------- Middleware */
app.use(express.json())

app.use(requestLogger)

app.use(cors())

app.use(express.static('build'))

/*
---------------------------- Routers */
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/tasks', (request, response) => {
  Task.find({}).then(tasks => {
    response.json(tasks)
  })
})

app.get('/api/tasks/:id', (request, response, next) => {
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

app.delete('/api/tasks/:id', (request, response, next) => {
  Task.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/tasks', (request, response) => {
  const body = request.body

  if (body.title === undefined) {
    return response.status(400).json({ error: 'title is required' })
  }

  const task = new Task({
    title: body.title,
    date: new Date(),
    completed: body.completed || false
  })

  task.save().then(savedTask => {
    response.json(savedTask)
  })
})

app.put('/api/tasks/:id', (request, response, next) => {
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

/*
---------------------------- Error Handlers */
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)


/*
---------------------------- Port */
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
