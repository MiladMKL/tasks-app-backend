const express = require('express');
const app = express();

app.use(express.json())

const cors = require('cors')
app.use(cors())


let tasks = [
  {
    id: 1,
    title: "HTML is easy",
    date: "2022-05-30T17:30:31.098Z",
    completed: false
  },
  {
    id: 2,
    title: "CSS is easy",
    date: "2022-05-30T18:39:34.091Z",
    completed: false
  },
  {
    id: 3,
    title: "Javascript is difficult",
    date: "2022-05-30T19:20:14.298Z",
    completed: false
  },
]

app.get('/', (request, response) => {
  response.send('<h1>Hello there user!</h1>')
})

app.get('/api/tasks', (request, response) => {
  response.json(tasks)
})

app.get('/api/tasks/:id', (request, response) => {
  const id = Number(request.params.id)
  const task = tasks.find(task => task.id === id)

  if (task) {
    response.json(task)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/tasks/:id', (request, response) => {
  const id = Number(request.params.id)
  tasks = tasks.filter(task => task.id !== id) // Überschreibe tasks mit einer neuen Liste
  response.status(204).end()
})

app.post('/api/tasks', (request, response) => {
  const task = request.body
  console.log(task)
  response.json(task)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
