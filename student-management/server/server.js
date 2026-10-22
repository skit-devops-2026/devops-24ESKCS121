const express = require('express')
const cors = require('cors')

const app = express()
const PORT = 5000

// react frontend se request aane deta hai
app.use(cors())

// Allow the server to read JSON request bodies
app.use(express.json())

app.get('/api/health', (req, res) => {
    res.json({
        message: 'Student Management API is running!'
    })
})

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})