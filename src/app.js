import express from 'express'
import mongoose from 'mongoose'
import session from 'express-session'
import path from 'path'
import { fileURLToPath } from 'url'

import { register, login, logout } from './controllers/authController.js'
import {
  getAllSnippets,
  createSnippet,
  deleteSnippet,
  getEditPage,
  updateSnippet
} from './controllers/snippetController.js'

import { requireAuth } from './middleware/requireAuth.js'
import dotenv from 'dotenv'
dotenv.config()

// Connecting to MongoDb Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((err) => {
    console.log('MonogDB connection error:', err)
  })

// Create the app
const app = express()

app.set('view engine', 'ejs')

// Setting up session middleware
app.use(session({
  secret: 'secretkey',
  resave: false,
  saveUninitialized: false
}))

app.use((req, res, next) => {
  res.locals.sessionUserId = req.session.userId
  next()
})

app.use(express.static('src/public'))
app.use(express.urlencoded({ extended: false }))
// Find the current path
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.set('views', path.join(__dirname, 'views'))

// Redirect root to snippets
app.get('/', (req, res) => {
  res.render('home', {
    sessionUserId: req.session.userId
  })
})

// Auth
app.get('/register', (req, res) => res.render('register'))
app.post('/register', register)

app.get('/login', (req, res) => res.render('login'))
app.post('/login', login)

app.post('/logout', logout)

// Snippets
app.get('/snippets', getAllSnippets)
app.post('/snippets', requireAuth, createSnippet)

app.get('/snippets/:id/edit', requireAuth, getEditPage)
app.post('/snippets/:id/edit', requireAuth, updateSnippet)

app.post('/snippets/:id/delete', requireAuth, deleteSnippet)

// Export the app to server.js
export default app
