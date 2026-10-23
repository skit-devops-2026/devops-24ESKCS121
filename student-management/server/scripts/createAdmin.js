
require('dotenv').config()

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('../models/User')

async function createAdmin() {
    try {
        const requiredFields = [
            'ADMIN_NAME',
            'ADMIN_COLLEGE',
            'ADMIN_MOBILE',
            'ADMIN_EMAIL',
            'ADMIN_USERNAME',
            'ADMIN_PASSWORD'
        ]

        const missingFields = requiredFields.filter(
            (field) => !process.env[field]
        )

        if (missingFields.length > 0) {
            throw new Error(
                `Missing environment variables: ${missingFields.join(', ')}`
            )
        }

        if (process.env.ADMIN_PASSWORD.length < 8) {
            throw new Error('Admin password must be at least 8 characters.')
        }

        await mongoose.connect(process.env.MONGO_URI)

        const existingAdmin = await User.findOne({ role: 'Admin' })

        if (existingAdmin) {
            console.log('An Admin account already exists. No changes made.')
            return
        }

        const username = process.env.ADMIN_USERNAME.trim().toLowerCase()
        const email = process.env.ADMIN_EMAIL.trim().toLowerCase()

        const duplicate = await User.findOne({
            $or: [{ username }, { email }]
        })

        if (duplicate) {
            throw new Error(
                'That email or username is already used by another account.'
            )
        }

        const hashedPassword = await bcrypt.hash(
            process.env.ADMIN_PASSWORD,
            12
        )

        await User.create({
            name: process.env.ADMIN_NAME.trim(),
            college: process.env.ADMIN_COLLEGE.trim(),
            mobile: process.env.ADMIN_MOBILE.trim(),
            email,
            username,
            password: hashedPassword,
            role: 'Admin',
            approvalStatus: 'approved'
        })

        console.log('Admin account created successfully.')
    } catch (error) {
        console.error('Admin setup failed:', error.message)
        process.exitCode = 1
    } finally {
        await mongoose.disconnect().catch(() => { })
    }
}

createAdmin()
