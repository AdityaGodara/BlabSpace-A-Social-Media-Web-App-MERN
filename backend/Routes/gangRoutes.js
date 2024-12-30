const express = require('express')
const router = express.Router()

const { User } = require("../models/userModel")
const { Gang } = require("../models/gangModel")

//Create a gang
router.post('/new-gang', async (req, res) => {
    const data = {
        name: req.body.name,
        gangsign: req.body.gangsign,
        tagline: req.body.tagline,
        leader: req.body.leader,
        logo: req.body.logo,
        description: req.body.description,
        category: req.body.category,
        members: req.body.leader
    };

    try {
        const existingGang = await Gang.findOne({ gangsign: data.gangsign });
        if (existingGang) {
            return res.status(400).json({ message: "Gang Already Exists" });
        }

        const newGang = new Gang(data);
        const savedGang = await newGang.save();

        // Add the gang ID to the user's document
        await User.findByIdAndUpdate(
            req.body.leader,
            { gang_id: savedGang._id, isLeader: true },
            { new: true, useFindAndModify: false }
        );

        console.log(savedGang);
        res.status(201).json({ 
            message: "Gang registered successfully!",
            gangId: savedGang._id
        });

    } catch (error) {
        console.error('Error creating gang:', error);
        res.status(500).json({ message: "Error creating gang", error: error.message });
    }
});

//Add new gang member
router.put('/new-member/:gangId', async (req,res)=>{
    const { gangId } = req.params
    try {
        
        const newMember = await Gang.findByIdAndUpdate(gangId, {$push:{members: req.body.userId}}, {unique: true} )
        const userUpdate = await User.findOneAndUpdate({_id: req.body.userId}, {gang_id: gangId})
        console.log(newMember)
        res.status(200).json({ message: "New member joined!" })

    } catch (error) {
        res.json({message: error})
    }
})

//Get list of all gangs
router.get('/all-gangs', async (req,res)=>{

    try {
        const allGangs = await Gang.find({})
        return res.status(200).json({
            count: allGangs.length,
            data: allGangs
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({message: error})
    }
})

//Get gang info by ID
router.get('/info/:g_id', async (req,res)=>{
    const {g_id} = req.params
    try {
        const singleGang = await Gang.findById(g_id)
        return res.json({ 
            count: singleGang.length,
            data: singleGang
         })

    } catch (error) {
        console.log(error)
        res.status(500).json({message: error})
    }
})

//Leave gang and set member gang IDs to null
router.put('/leave-gang/:gangId', async (req,res)=>{
    const { gangId } = req.params
    try {
        
        const newMember = await Gang.findByIdAndUpdate(gangId, {$pull:{members: req.body.userId}} )
        const userUpdate = await User.findOneAndUpdate({_id: req.body.userId}, {gang_id: null, isLeader: false})
        console.log(newMember)
        res.status(200).json({ message: "You left the gang :(" })

    } catch (error) {
        res.json({message: error})
    }
})

module.exports = router