const mongoose = require('mongoose')

/** This defines on the Schema for MongoDB */

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3
  },
  date: Date,
  completed: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

taskSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Task', taskSchema)