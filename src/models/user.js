import mongoose from 'mongoose'

// Define the user model schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
})

// Creating the model
export const User = mongoose.model('User', userSchema)
