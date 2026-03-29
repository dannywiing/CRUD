/**
 * Middleware to check if user is authenticated
 * @param {Request} req HTTP request
 * @param {Response} res HTTP response
 * @param {import('express').NextFunction} next Function to pass control
 * @returns {void}
 */
export function requireAuth (req, res, next) {
  // Checking if user is logged in
  if (!req.session.userId) {
    return res.status(403).send('Forbidden')
  }

  next()
}
