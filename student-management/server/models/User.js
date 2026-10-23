
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        college: {
            type: String,
            required: true,
            trim: true
        },

        mobile: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
            select: false
        },

        role: {
            type: String,
            enum: ['Student', 'Teacher', 'Admin'],
            required: true
        },

        academicYear: {
            type: String,
            required: function () {
                return this.role === 'Student'
            }
        },

        department: {
            type: String,
            required: function () {
                return this.role === 'Teacher'
            },
            trim: true
        },

        designation: {
            type: String,
            required: function () {
                return this.role === 'Teacher'
            },
            trim: true
        },

        approvalStatus: {
            type: String,
            enum: ['pending', 'approved'],
            default: function () {
                return this.role === 'Teacher' ? 'pending' : 'approved'
            }
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('User', userSchema)
