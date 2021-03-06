// Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");

// Set up the Express App
const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("Public"));

// Basic route that sends the user to the index page
app.get("/", (req, res) =>{
    res.sendFile(path.join(__dirname, 'Public/index.html'));
});

// Basic route that sends the user to the notes page
app.get("/notes", (req, res) =>{
    res.sendFile(path.join(__dirname, 'Public/notes.html'));
});

// Route that sends the user to the db.json file
app.get("/api/notes", (req, res) =>{
    res.sendFile(path.join(__dirname, '/db/db.json'));
});

// Takes a JSON input with keys "title" and "text" and adds a new note object with that message to the db.json file
app.post("/api/notes", function(req, res) {
    fs.readFile(path.join(__dirname, "/db/db.json"), "utf8", function(error, response) {
        if (error) {
            console.log(error);
        }
        const notes = JSON.parse(response);
        const noteRequest = req.body;
        const newNoteId = notes.length + 1;
        const newNote = {
            id: newNoteId,
            title: noteRequest.title,
            text: noteRequest.text,
        };
        console.log(newNote);
        notes.push(newNote);
        res.json(newNote);
        fs.writeFile(path.join(__dirname, "/db/db.json"), JSON.stringify(notes, null, 2), function(err) {
            if (err) throw err;
        });
    });

});
app.delete("/api/notes/:id", function(req, res) {
    const deleteId = req.params.id;
    fs.readFile("db/db.json", "utf8", function(error, response) {
        if (error) {
            console.log(error);
        }
        let notes = JSON.parse(response);
        if (deleteId <= notes.length) {
        
            res.json(notes.splice(deleteId-1,1));
            // Reassign the ids of all notes
            for (let i=0; i<notes.length; i++) {
                notes[i].id = i+1;
            }
            fs.writeFile("db/db.json", JSON.stringify(notes, null, 2), function(err) {
                if (err) throw err;
            });
        } else {
            res.json(false);
        }
    });
});
// Starts the server to begin listening
app.listen(PORT, () => {
	console.log(`App is listening ${PORT}.`)
});
