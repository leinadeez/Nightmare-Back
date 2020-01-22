const express = require('express')
const router = express.Router()
const User = require('../models/user')

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find()
        const data = {users}
        res.json(data)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Get one user
router.get('/:username', (req, res) => {
    User.findOne({ username: req.body.username }, function(err, user) {
        try {
            user.comparePassword(req.body.password, function(err, isMatch) {
                if (isMatch) {
                    res.status(200).json(user)
                } else {
                    res.status(401).json({ message: 'beeeh invalid password =(' })
                }
            })
        } catch (err) {
            res.status(404).json({ message: err.message })
        }        
    });
})

// Create one user
router.post('/', async (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password,
    })
      try {
        const newUser = await user.save()
        res.status(201).json(newUser)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

async function getUser(req, res, next) {
    try {
        user = await User.findById(req.params.id)
        if (user == null) {
            return res.status(404).json({ message: 'Cant find user'})
        }
    } catch(err){
        return res.status(500).json({ message: err.message })
    }
  
    res.user = user
    next()
}

module.exports = router