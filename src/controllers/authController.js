import bcrypt from 'bcrypt'
import { User } from '../models/user.js'

/**
 * Register new user
 * @param {Request} req HTTP request object
 * @param {Response} res HTTP response object
 */
export async function register (req, res) {
  try {
    // Getting username and password from form
    const { username, password } = req.body

    const hash = await bcrypt.hash(password, 10)

    // Creating a new user object
    await User.create({
      username,
      password: hash
    })

    res.redirect('/')
  } catch (error) {
    console.log(error)
    return res.status(599).render('error', {
      message: 'User already exists'
    })
  }
}

/**
 * Logs in a existing user
 * @param {Request} req HTTP response object
 * @param {Response} res HTTP request object
 * @returns {Promise<void>} Redirects to home page
 */
export async function login (req, res) {
  try {
    const { username, password } = req.body

    // Fiding user in database
    const user = await User.findOne({ username })

    // If no user found
    if (!user) {
      return res.status(401).render('error', {
        message: 'User not found'
      })
    }

    // Comparing entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).render('error', {
        message: 'Wrong password'
      })
    }

    req.session.userId = user._id.toString()

    res.redirect('/')
  } catch (error) {
    console.log(error)
    res.status(500).send('Internal server error')
  }
}

/**
 * Logout the user
 * @param {Request} req HTTP rrquest object
 * @param {Response} res HTTP response object
 */
export function logout (req, res) {
  req.session.destroy(() => {
    res.redirect('/')
  })
}
