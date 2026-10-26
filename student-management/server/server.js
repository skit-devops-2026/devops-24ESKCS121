
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const authRoutes = require('./routes/authRoutes')
const studentRoutes = require('./routes/studentRoutes')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        message: 'Student Management API is running!'
    })
})

// Authentication routes
app.use('/api/auth', authRoutes)
app.use('/api/students', studentRoutes)

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
