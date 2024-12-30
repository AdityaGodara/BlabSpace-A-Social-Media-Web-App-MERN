const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true
        },
        email:{
            type: String,
            required: true
        },
        username:{
            type: String,
            required: true
        },
        password:{
            type: String,
            required: true
        },
        gender:{
            type: String,
            required: true
        },
        avatar:{
            type: String,
            required: true
        },
        isLeader:{
            type: Boolean,
            required : false
        },
        gang_id:{
            type: String,
            required: false
        }
    },
    {
        timestamps: true
    }
)

const User = mongoose.model("User", userSchema)
module.exports = {User}