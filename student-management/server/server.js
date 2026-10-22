
const express = require('express')

const app = express()
const PORT = 5000

app.get('/api/health', (req, res) => {
    res.json({
        message: 'Student Management API is running!'
    })
})

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})
