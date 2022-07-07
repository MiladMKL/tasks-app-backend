const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const tasksRouter = require('./controllers/tasks')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')


/*
---------------------------- Connect to MongoDB */

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.info('error connecting to MongoDB', error.message)
  })


/*
---------------------------- Generic Middlewares */

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)


/*
---------------------------- Router Middleware */
app.use('/api/tasks', tasksRouter)


/*
---------------------------- Error Middlewares */
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


module.exports = app