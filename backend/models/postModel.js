const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
    {
        uname:{
            type: String,
            required: true
        },
        post_title: {
            type: String,
            required: true
        },
        post_desc: {
            type: String,
            required: true
        },
        pfp: {
            type: String,
            required: true
        },
        gangID: {
            type: String,
            required: true
        },
        byLeader: {
            type: Boolean,
            required: false
        },
        comments: [{username: String, txt: String, gangName: String}]
    },
    {
        timestamps: true
    }
)

const Post = mongoose.model("Post", postSchema)
module.exports = { Post }