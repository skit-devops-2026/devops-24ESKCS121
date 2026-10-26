
const express = require('express')
const mongoose = require('mongoose')
const User = require('../models/User')

const {
    authenticateToken,
    requireAdmin
} = require('../middleware/authMiddleware')

const router = express.Router()

// Verify the current Admin account still exists and is approved.
async function verifyAdmin(userId) {
    const admin = await User.findById(userId)

    return Boolean(
        admin &&
        admin.role === 'Admin' &&
        admin.approvalStatus === 'approved'
    )
}

// Admin approves a pending Teacher account.
router.patch(
    '/teachers/:id/approve',
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            if (!mongoose.isValidObjectId(req.params.id)) {
                return res.status(400).json({
                    message: 'Invalid teacher ID.'
                })
            }

            if (!(await verifyAdmin(req.user.userId))) {
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

            if (teacher.approvalStatus !== 'pending') {
                return res.status(400).json({
                    message: 'Only pending Teacher accounts can be approved.'
                })
            }

            teacher.approvalStatus = 'approved'
            await teacher.save()

            return res.status(200).json({
                message: 'Teacher approved successfully.',
                user: publicUser(teacher)
            })
        } catch (error) {
            console.error('Teacher approval error:', error.message)

            return res.status(500).json({
                message: 'Unable to approve Teacher right now.'
            })
        }
    }
)

// Admin rejects a pending Teacher account.
router.patch(
    '/teachers/:id/reject',
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            if (!mongoose.isValidObjectId(req.params.id)) {
                return res.status(400).json({
                    message: 'Invalid teacher ID.'
                })
            }

            if (!(await verifyAdmin(req.user.userId))) {
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

            if (teacher.approvalStatus !== 'pending') {
                return res.status(400).json({
                    message: 'Only pending Teacher accounts can be rejected.'
                })
            }

            teacher.approvalStatus = 'rejected'
            await teacher.save()

            return res.status(200).json({
                message: 'Teacher rejected successfully.',
                user: publicUser(teacher)
            })
        } catch (error) {
            console.error('Teacher rejection error:', error.message)

            return res.status(500).json({
                message: 'Unable to reject Teacher right now.'
            })
        }
    }
)

// Admin views all Teacher accounts.
router.get(
    '/teachers',
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            if (!(await verifyAdmin(req.user.userId))) {
                return res.status(403).json({
                    message: 'Admin access is required.'
                })
            }

            const teachers = await User.find({ role: 'Teacher' })
                .select('-password')
                .sort({ createdAt: -1 })

            return res.status(200).json({
                count: teachers.length,
                teachers: teachers.map((teacher) => ({
                    id: teacher._id,
                    name: teacher.name,
                    college: teacher.college,
                    mobile: teacher.mobile,
                    email: teacher.email,
                    username: teacher.username,
                    department: teacher.department,
                    designation: teacher.designation,
                    approvalStatus: teacher.approvalStatus,
                    createdAt: teacher.createdAt
                }))
            })
        } catch (error) {
            console.error('Get teachers error:', error.message)

            return res.status(500).json({
                message: 'Unable to retrieve teachers.'
            })
        }
    }
)

// Return safe user details without the password.
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


// Admin updates Teacher details.
router.put('/teachers/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid teacher ID.'
            })
        }

        const admin = await User.findById(req.user.userId)

        if (
            !admin ||
            admin.role !== 'Admin' ||
            admin.approvalStatus !== 'approved'
        ) {
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

        const allowedFields = [
            'name',
            'college',
            'mobile',
            'email',
            'username',
            'department',
            'designation'
        ]

        const updates = req.body

        if (
            !updates ||
            typeof updates !== 'object' ||
            Array.isArray(updates)
        ) {
            return res.status(400).json({
                message: 'Please provide valid update details.'
            })
        }

        const providedFields = Object.keys(updates)

        if (
            providedFields.length === 0 ||
            providedFields.some(field => !allowedFields.includes(field))
        ) {
            return res.status(400).json({
                message: 'Provide valid Teacher fields only.'
            })
        }

        for (const field of providedFields) {
            if (
                typeof updates[field] !== 'string' ||
                !updates[field].trim()
            ) {
                return res.status(400).json({
                    message: `${field} must be a non-empty string.`
                })
            }
        }

        const normalizedUpdates = {}

        for (const field of providedFields) {
            normalizedUpdates[field] = updates[field].trim()
        }

        if (normalizedUpdates.email) {
            normalizedUpdates.email = normalizedUpdates.email.toLowerCase()
        }

        if (normalizedUpdates.username) {
            normalizedUpdates.username = normalizedUpdates.username.toLowerCase()
        }

        if (normalizedUpdates.email || normalizedUpdates.username) {
            const duplicateConditions = []

            if (normalizedUpdates.email) {
                duplicateConditions.push({
                    email: normalizedUpdates.email
                })
            }

            if (normalizedUpdates.username) {
                duplicateConditions.push({
                    username: normalizedUpdates.username
                })
            }

            const existingUser = await User.findOne({
                _id: { $ne: teacher._id },
                $or: duplicateConditions
            })

            if (existingUser) {
                return res.status(409).json({
                    message: 'Email or username is already in use.'
                })
            }
        }

        Object.assign(teacher, normalizedUpdates)

        await teacher.save()

        return res.status(200).json({
            message: 'Teacher updated successfully.',
            user: {
                id: teacher._id,
                name: teacher.name,
                college: teacher.college,
                mobile: teacher.mobile,
                email: teacher.email,
                username: teacher.username,
                department: teacher.department,
                designation: teacher.designation,
                approvalStatus: teacher.approvalStatus
            }
        })
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: 'Email or username is already in use.'
            })
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Please check the Teacher details.'
            })
        }

        console.error('Teacher update error:', error.message)

        return res.status(500).json({
            message: 'Unable to update Teacher right now.'
        })
    }
})


/* DELETE /api/admin/teachers/:id */
router.delete('/teachers/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        if (!(await verifyAdmin(req.user.userId))) {
            return res.status(403).json({
                message: 'Admin account is not authorized.'
            })
        }

        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Invalid Teacher ID.'
            })
        }

        const teacher = await User.findOne({
            _id: id,
            role: 'Teacher'
        })

        if (!teacher) {
            return res.status(404).json({
                message: 'Teacher not found.'
            })
        }

        await User.deleteOne({ _id: teacher._id })

        return res.status(200).json({
            message: 'Teacher deleted successfully.',
            id: teacher._id
        })
    } catch (error) {
        console.error('Delete Teacher Error:', error)

        return res.status(500).json({
            message: 'Internal server error.'
        })
    }
})


module.exports = router
