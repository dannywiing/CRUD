import app from './app.js'
// Define which port the server should listen on
const PORT = 3000

// Start the server and lsiten for incoming request
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
