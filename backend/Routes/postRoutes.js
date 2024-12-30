const express = require('express')
const router = express.Router()

const { User } = require("../models/userModel")
const { Gang } = require("../models/gangModel")
const { Post } = require("../models/postModel")

//Create New Post
router.post('/new-post', async (req, res) => {
    const data = {
        uname: req.body.uname,
        post_title: req.body.post_title,
        post_desc: req.body.post_desc,
        pfp: req.body.pfp,
        gangID: req.body.gangID,
        byLeader: req.body.byLeader
    }

    try {

        const newPost = new Post(data)
        const savedPost = await newPost.save()

        res.status(200).json({ message: 'Posted successfully', data: savedPost })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
})

//GET POSTS ACCORDING TO GANG ID
router.post('/:id', async (req, res) => {

    const { id } = req.params

    try {

        const findPosts = await Post.find({ gangID: id })

        return res.status(200).json({
            count: findPosts.length,
            data: findPosts
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
})

//ADD COMMENT ON POST
router.put('/add-comment/:id', async (req, res) => {
    const { id } = req.params;
    const { uname, txt, gname } = req.body;

    if (!uname || !txt) {
        return res.status(400).json({ message: "Username and comment text are required" });
    }

    try {
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { $push: { comments: { username: uname, txt: txt, gangName: gname } } },
            { new: true, runValidators: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ message: "Post not found" });
        }

        console.log("New comment added:", updatedPost.comments[updatedPost.comments.length - 1]);
        res.status(200).json({
            message: "New comment added!",
            comment: updatedPost.comments[updatedPost.comments.length - 1]
        });

    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "Error adding comment", error: error.message });
    }
});

//DELETE A POST BY ID
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params

    try {

        const deletePost = await Post.findByIdAndDelete(id)
        if (deletePost) {
            res.status(200).json({ message: "Post has been deleted" })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
})

//GET A PARTICULAR POST BY ID
router.get('/info/:pid', async (req, res) => {
    const { pid } = req.params
    
    try {

        const singlePost = await Post.findById(pid)
        return res.json({
            count: singlePost.length,
            data: singlePost
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
})

module.exports = router