require('dotenv').config()

/** Holt environment variablen aus .env und exportiert sie bzw. ist für .env handling zuständig */

const PORT = process.env.PORT
const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

module.exports = {
  MONGODB_URI,
  PORT
}