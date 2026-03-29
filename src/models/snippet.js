import mongoose from 'mongoose'

// Creating schema for snippets
const snippetSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId, // Storing user id
    ref: 'User',
    required: true
  }
})

export const Snippet = mongoose.model('Snippet', snippetSchema)
