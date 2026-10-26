
const express = require('express')
const mongoose = require('mongoose')
const User = require('../models/User')
const { authenticateToken } = require('../middleware/authMiddleware')

const router = express.Router()

// Return safe student data without passwords.
function publicStudent(student) {
    return {
        id: student._id,
        name: student.name,
        college: student.college,
        mobile: student.mobile,
        email: student.email,
        username: student.username,
        academicYear: student.academicYear,
        createdAt: student.createdAt,
        updatedAt: student.updatedAt
    }
}

// GET /api/students
// List all students. Only approved Teachers and Admins can access this list.
router.get('/', authenticateToken, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.userId)

        if (
            !currentUser ||
            (currentUser.role !== 'Admin' &&
                !(currentUser.role === 'Teacher' &&
                    currentUser.approvalStatus === 'approved'))
        ) {
            return res.status(403).json({
                message: 'You are not allowed to view all students.'
            })
        }

        const students = await User.find({ role: 'Student' })
            .sort({ createdAt: -1 })

        return res.status(200).json({
            count: students.length,
            students: students.map(publicStudent)
        })
    } catch (error) {
        console.error('List students error:', error.message)

        return res.status(500).json({
            message: 'Unable to retrieve students.'
        })
    }
})

// GET /api/students/:id
// Students can view their own record; approved Teachers and Admins can view any.
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid student ID.'
            })
        }

        const student = await User.findOne({
            _id: req.params.id,
            role: 'Student'
        })

        if (!student) {
            return res.status(404).json({
                message: 'Student not found.'
            })
        }

        const currentUser = await User.findById(req.user.userId)

        if (!currentUser) {
            return res.status(401).json({
                message: 'User account no longer exists.'
            })
        }

        const isOwnRecord =
            currentUser.role === 'Student' &&
            currentUser._id.toString() === student._id.toString()

        const isAdmin = currentUser.role === 'Admin'

        const isApprovedTeacher =
            currentUser.role === 'Teacher' &&
            currentUser.approvalStatus === 'approved'

        if (!isOwnRecord && !isAdmin && !isApprovedTeacher) {
            return res.status(403).json({
                message: 'You are not allowed to view this student.'
            })
        }

        return res.status(200).json({
            student: publicStudent(student)
        })
    } catch (error) {
        console.error('Get student error:', error.message)

        return res.status(500).json({
            message: 'Unable to retrieve student.'
        })
    }
})


const bcrypt = require('bcryptjs')

// PUT /api/students/:id
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid student ID.'
            })
        }

        const student = await User.findOne({
            _id: req.params.id,
            role: 'Student'
        })

        if (!student) {
            return res.status(404).json({
                message: 'Student not found.'
            })
        }

        const currentUser = await User.findById(req.user.userId)

        if (!currentUser) {
            return res.status(401).json({
                message: 'User account no longer exists.'
            })
        }

        const isOwnRecord =
            currentUser.role === 'Student' &&
            currentUser._id.toString() === student._id.toString()

        const isAdmin = currentUser.role === 'Admin'

        const isApprovedTeacher =
            currentUser.role === 'Teacher' &&
            currentUser.approvalStatus === 'approved'

        if (!isOwnRecord && !isAdmin && !isApprovedTeacher) {
            return res.status(403).json({
                message: 'You are not allowed to update this student.'
            })
        }

        const allowedFields = [
            'name',
            'college',
            'mobile',
            'email',
            'username',
            'academicYear'
        ]

        const updates = {}

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                if (
                    typeof req.body[field] !== 'string' ||
                    !req.body[field].trim()
                ) {
                    return res.status(400).json({
                        message: `${field} must be a non-empty string.`
                    })
                }

                updates[field] = req.body[field].trim()
            }
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                message: 'Provide at least one valid field to update.'
            })
        }

        if (updates.email) {
            updates.email = updates.email.toLowerCase()
        }

        if (updates.username) {
            updates.username = updates.username.toLowerCase()
        }

        let duplicate = null

        if (updates.email || updates.username) {
            const conditions = []

            if (updates.email) {
                conditions.push({ email: updates.email })
            }

            if (updates.username) {
                conditions.push({ username: updates.username })
            }

            duplicate = await User.findOne({
                _id: { $ne: student._id },
                $or: conditions
            })
        }

        if (duplicate) {
            return res.status(409).json({
                message: 'Email or username is already registered.'
            })
        }

        Object.assign(student, updates)
        await student.save()

        return res.status(200).json({
            message: 'Student updated successfully.',
            student: publicStudent(student)
        })
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: 'Email or username is already registered.'
            })
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Please check the student details.'
            })
        }

        console.error('Update student error:', error.message)

        return res.status(500).json({
            message: 'Unable to update student.'
        })
    }
})

// DELETE /api/students/:id
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid student ID.'
            })
        }

        const currentUser = await User.findById(req.user.userId)

        if (!currentUser) {
            return res.status(401).json({
                message: 'User account no longer exists.'
            })
        }

        if (currentUser.role !== 'Admin') {
            return res.status(403).json({
                message: 'Only Admin can delete student records.'
            })
        }

        const student = await User.findOneAndDelete({
            _id: req.params.id,
            role: 'Student'
        })

        if (!student) {
            return res.status(404).json({
                message: 'Student not found.'
            })
        }

        return res.status(200).json({
            message: 'Student deleted successfully.'
        })
    } catch (error) {
        console.error('Delete student error:', error.message)

        return res.status(500).json({
            message: 'Unable to delete student.'
        })
    }
})

module.exports = router
