
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const {
    authenticateToken,
    requireAdmin
} = require('../middleware/authMiddleware')

const router = express.Router()

// Create a safe user response without the password.
function publicUser(user) {
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        approvalStatus: user.approvalStatus
    }
}

// Register a Student or Teacher.
router.post('/register', async (req, res) => {
    try {
        const {
            name,
            college,
            mobile,
            email,
            username,
            password,
            role,
            academicYear,
            department,
            designation
        } = req.body

        if (
            !name ||
            !college ||
            !mobile ||
            !email ||
            !username ||
            !password ||
            !role
        ) {
            return res.status(400).json({
                message: 'Please fill in all required fields.'
            })
        }

        // Public registration must never create Admin accounts.
        if (!['Student', 'Teacher'].includes(role)) {
            return res.status(400).json({
                message: 'Only Student and Teacher registration is allowed.'
            })
        }

        if (typeof password !== 'string' || password.length < 8) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters long.'
            })
        }

        if (
            typeof name !== 'string' ||
            typeof college !== 'string' ||
            typeof mobile !== 'string' ||
            typeof email !== 'string' ||
            typeof username !== 'string'
        ) {
            return res.status(400).json({
                message: 'Please provide valid registration details.'
            })
        }

        if (role === 'Student' && !academicYear) {
            return res.status(400).json({
                message: 'Academic year is required for students.'
            })
        }

        if (role === 'Teacher' && (!department || !designation)) {
            return res.status(400).json({
                message: 'Department and designation are required for teachers.'
            })
        }

        const normalizedEmail = email.trim().toLowerCase()
        const normalizedUsername = username.trim().toLowerCase()

        const existingUser = await User.findOne({
            $or: [
                { email: normalizedEmail },
                { username: normalizedUsername }
            ]
        })

        if (existingUser) {
            return res.status(409).json({
                message: 'Email or username is already registered.'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        const user = await User.create({
            name: name.trim(),
            college: college.trim(),
            mobile: mobile.trim(),
            email: normalizedEmail,
            username: normalizedUsername,
            password: hashedPassword,
            role,
            ...(role === 'Student'
                ? { academicYear }
                : {
                    department: department.trim(),
                    designation: designation.trim()
                }),
            approvalStatus: role === 'Teacher' ? 'pending' : 'approved'
        })

        // Students can log in immediately after registration.
        if (role === 'Student') {
            const secret = process.env.JWT_SECRET

            if (!secret) {
                console.error('JWT_SECRET is missing from the environment.')
                return res.status(500).json({
                    message: 'Server configuration error.'
                })
            }

            const token = jwt.sign(
                { userId: user._id.toString(), role: user.role },
                secret,
                { expiresIn: '1d' }
            )

            return res.status(201).json({
                message: 'Student registered successfully.',
                token,
                user: publicUser(user)
            })
        }

        return res.status(201).json({
            message: 'Teacher registered. Please wait for Admin approval.',
            user: publicUser(user)
        })
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: 'Email or username is already registered.'
            })
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Please check the registration details.'
            })
        }

        console.error('Registration error:', error.message)

        return res.status(500).json({
            message: 'Unable to register right now.'
        })
    }
})

// Login using username and password.
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body

        if (
            typeof username !== 'string' ||
            !username.trim() ||
            typeof password !== 'string' ||
            !password
        ) {
            return res.status(400).json({
                message: 'Username and password are required.'
            })
        }

        const user = await User.findOne({
            username: username.trim().toLowerCase()
        }).select('+password')

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                message: 'Invalid username or password.'
            })
        }

        if (user.role === 'Teacher' && user.approvalStatus !== 'approved') {
            return res.status(403).json({
                message: 'Your account is awaiting Admin approval.'
            })
        }

        const secret = process.env.JWT_SECRET

        if (!secret) {
            console.error('JWT_SECRET is missing from the environment.')
            return res.status(500).json({
                message: 'Server configuration error.'
            })
        }

        const token = jwt.sign(
            { userId: user._id.toString(), role: user.role },
            secret,
            { expiresIn: '1d' }
        )

        return res.status(200).json({
            message: 'Login successful.',
            token,
            user: publicUser(user)
        })
    } catch (error) {
        console.error('Login error:', error.message)

        return res.status(500).json({
            message: 'Unable to log in right now.'
        })
    }
})


// Admin approves a pending Teacher account.
router.patch('/teachers/:id/approve', authenticateToken, requireAdmin, async (req, res) => {
    try {
        // Verify the account still exists and is an Admin in MongoDB.
        const admin = await User.findById(req.user.userId)

        if (!admin || admin.role !== 'Admin' || admin.approvalStatus !== 'approved') {
            return res.status(403).json({
                message: 'Admin access is required.'
            })
        }

        const teacher = await User.findOne({
            _id: req.params.id,
            role: 'Teacher'
        })

        if (!teacher) {
            return res.status(404).json({
                message: 'Teacher account not found.'
            })
        }

        if (teacher.approvalStatus === 'approved') {
            return res.status(200).json({
                message: 'Teacher is already approved.',
                user: publicUser(teacher)
            })
        }

        teacher.approvalStatus = 'approved'
        await teacher.save()

        return res.status(200).json({
            message: 'Teacher approved successfully.',
            user: publicUser(teacher)
        })
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                message: 'Invalid teacher ID.'
            })
        }

        console.error('Teacher approval error:', error.message)

        return res.status(500).json({
            message: 'Unable to approve Teacher right now.'
        })
    }
})

module.exports = router
