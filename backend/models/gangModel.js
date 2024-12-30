const mongoose = require('mongoose')
const { User } = require('./userModel')

const gangSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        tagline: {
            type: String,
            required: true
        },
        gangsign: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        category:{
            type: String,
            required: true
        },
        logo:{
            type: String,
            required: true
        },
        leader:{
            type: String,
            required: true
        },
        members: [
            {
                type: 'ObjectId' ,
                ref: 'User',
                required: false,
            }
        ]
    },
    {
        timestamps: true
    }
)

const Gang = mongoose.model("Gang", gangSchema)
module.exports = { Gang }