const express = require('express');
const app = express();
const path = require('path');
const db = require('./db/db.json');
const fs = require('fs');
const uuid = require('./randomUUID/uuid.js');

const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => 
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    res.json(db);
});

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
    const newNote = {
        id: uuid(),
        title: title,
        text: text
    };
    if(title && text) {
        db.push(newNote);
        fs.writeFile('./db/db.json', JSON.stringify(db, null, 2), (err) => 
            err ? console.log(err) : console.log('File written successfully'));
        res.status(200).json(newNote);
    } else {
        res.status(400).json({ error: 'Missing required fields' });
    }
});

app.delete('/api/notes/:id', (req, res) => {
    const { id } = req.params;
    const noteIndex = db.findIndex(note => note.id === id);
    if(noteIndex !== -1) {
        db.splice(noteIndex, 1);
        fs.writeFile('./db/db.json', JSON.stringify(db, null, 2), (err) =>
            err ? console.log(err) : console.log('Data deleted successfully'));
        res.status(200).json({ message: 'Note deleted' });
    } else {
        res.status(404).json({ error: 'Note not found' });
    }
    // db.forEach((note, index) => {
    //     if(note.id === id) {
    //         db.splice(index, 1);
    //         console.log(index);
    //     }
    // });
    // fs.writeFile('./db/db.json', JSON.stringify(db, null, 2), (err) =>
    //     err ? console.log(err) : console.log('Data deleted successfully'));
    // res.status(200).json({ message: 'Note deleted' });
});


app.listen(PORT, () => 
    console.log(`Server is listening on port ${PORT}`)
);
