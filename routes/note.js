const express = require('express')
const router = express.Router() // Module
const Note = require("../models/Note");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator"); //!npm install --save express-validator

//! Route 1:  Get all Notes using : GET "/api/auth/fetchnotes". Login required
router.get('/fetchnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Something went wrong!");
    }
})


//! Route 2:  Add new Note using : POST "/api/note/addnote". Login required

router.post('/addnote', fetchuser, [
    body("title", "title must be atleast 3 charachters").isLength({ min: 1 }),
    body("description", "description must be atleast 5 charachters").isLength({ min: 3 }),
], async (req, res) => {
    const { title, description, tag } = req.body;

    try {
        // if any error occur in between
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = await new Note({
            title, description, tag, user: req.user.id
        })
        const savednotes = await note.save();
        res.json(savednotes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Something went wrong!");
    }

})
//! Route 3: Update Note using : PUT "/api/note/updatenote". Login required

router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        // Create new note object 
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        // Authenticate the valid user 
        let note = await Note.findById(req.params.id)
        if (!note) {
            return res.status(400).send('Item Not Found')
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send(" Access denied")
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note })

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Something went wrong!");
    }

})
//! Route 4: Delete Note using : DELETE "/api/note/deletenote". Login required

router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    // Create new note object 
    try {
        // find the note to be deleted and delete it.
        let note = await Note.findById(req.params.id)
        if (!note) {
            return res.status(400).send('Item Not Found')
        }

        //Allow deletion only to valid user
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send(" Access denied")
        }

        res.json({ "Success": `Note "${note.title}" has been deleted successfully` })
        note = await Note.findByIdAndDelete(req.params.id)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Something went wrong!");
    }

})
module.exports = router