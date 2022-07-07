const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
require('express-async-errors')

const tasksRouter = require('./controllers/tasks')
const usersRouter = require('./controllers/users')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')

/*
---------------------------- Connect to MongoDB */

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })


/*
---------------------------- Generic Middlewares */

/*
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('build'))
}
*/

// app.use(express.static('build'))
app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

/*
---------------------------- Router Middleware */
app.use('/api/tasks', tasksRouter)
app.use('/api/users', usersRouter)
/*
---------------------------- Error Middlewares */
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


module.exports = app