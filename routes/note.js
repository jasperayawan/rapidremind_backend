const router = require('express').Router();
const User = require('../models/auth.model')
const Note = require('../models/note.model')

router.post('/', async (req, res) => {
    try {
        const { _userId } = req.body;

        const user = await User.findOne({ _userId });

        const note = new Note({
            userId: user._id,
            content: req.body.content,
        });

        await note.save();
        res.status(200).json({ message: "Content saved successfully!", note });
    } catch (error) {
        res.status(400).json(error);
    }
});



module.exports = router;