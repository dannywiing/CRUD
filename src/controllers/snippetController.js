import { Snippet } from '../models/snippet.js'

/**
 * Retrieves and display all snippets
 * @param {Request} req HTTP request object
 * @param {Response} res HTTP response object
 */
export async function getAllSnippets (req, res) {
  const snippets = await Snippet.find().populate('owner')

  res.render('snippets', {
    snippets,
    sessionUserId: req.session.userId
  })
}

/**
 * Create a new snippet
 * @param {Request} req HTTP request object
 * @param {Response} res HTTP response object
 */
export async function createSnippet (req, res) {
  const { title, code } = req.body
  // Creating new snippet
  await Snippet.create({
    title,
    code,
    owner: req.session.userId
  })

  res.redirect('/snippets')
}

/**
 * Delete snippet
 * @param {Request} req HTTP request object
 * @param {Response} res HTTP response object
 * @returns {Promise<void>} Redirect to snippets
 */
export async function deleteSnippet (req, res) {
  const { id } = req.params

  // Finding snippet by id
  const snippet = await Snippet.findById(id)

  // If snippet does not exist
  if (!snippet) {
    return res.status(404).send('Snippet not found')
  }

  // Checking if logged in user is the owner
  if (snippet.owner.toString() !== req.session.userId) {
    return res.status(403).send('Forbidden')
  }

  // Deleting snippet
  await Snippet.findByIdAndDelete(id)

  res.redirect('/snippets')
}

/**
 * Edit snippets
 * @param {Request} req HTTP request object
 * @param {Response} res HTTP response object
 * @returns {Promise<void>} Redirect to edit page
 */
export async function getEditPage (req, res) {
  const { id } = req.params

  const snippet = await Snippet.findById(id)

  if (!snippet) {
    return res.status(404).send('Snippet not found')
  }
  // Checking if logged in user is the owner
  if (snippet.owner.toString() !== req.session.userId) {
    return res.status(403).send('Forbidden')
  }

  res.render('edit', { snippet })
}

/**
 * Update snippet
 * @param {Request} req HTTP request object
 * @param {Response} res HTTP response object
 * @returns {Promise<void>} Redirect to snippets
 */
export async function updateSnippet (req, res) {
  const { id } = req.params
  const { title, code } = req.body

  const snippet = await Snippet.findById(id)

  if (!snippet) {
    return res.status(404).send('Snippet not found')
  }
  // Checking if logged in user is the owner
  if (snippet.owner.toString() !== req.session.userId) {
    return res.status(403).send('Forbidden')
  }

  // Updating fields
  snippet.title = title
  snippet.code = code

  // saving changes
  await snippet.save()

  res.redirect('/snippets')
}
