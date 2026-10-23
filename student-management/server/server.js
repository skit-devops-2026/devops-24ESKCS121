
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
    res.json({
        message: 'Student Management API is running!'
    })
})

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB successfully!')

        app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`)
        })
    })
    .catch((error) => {
        console.error('MongoDB connection failed:', error.message)
        process.exit(1)
    })
