const Task = require('../models/task')
const User = require('../models/user')

const initialTasks = [
  {
    name: 'learn HTML',
    date: new Date(),
    done: true,
  },
  {
    name: 'learn CSS',
    date: new Date(),
    done: true,
  },
  {
    name: 'learn Javascript',
    date: new Date(),
    done: false,
  },
  {
    name: 'learn ReactJS',
    date: new Date(),
    done: false,
  }
]

const nonExistingId = async () => {
  const task = new Task({ name: 'willremovethissoon', date: new Date() })
  await task.save()
  await task.remove()

  return task._id.toString()
}

const tasksInDb = async () => {
  const tasks = await Task.find({})
  return tasks.map(task => task.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}


module.exports = {
  initialTasks,
  nonExistingId,
  tasksInDb,
  usersInDb,
}