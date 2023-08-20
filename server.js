const config = require('./config/config.json')
const express = require('express');
const bodyParser = require('body-parser')
const fs = require('fs');
const server = express();

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: false }))

// List static files from root folder for use
server.use(express.static(config.root))

// Notes get request
server.get('/notes', (request, response) => {
    let file = `${__dirname}/${config.root}/notes.html`
    console.log('notes: ' + file);
    response.sendFile(file);
});

server.route('/api/notes')
    // should read the db.json file and return all saved notes as JSON.
    .get((request, response) => {
        let file = `${__dirname}/${config.db}/db.json`
        console.log('attempting api get');
        response.sendFile(file)
    })
    // should receive a new note to save on the request body,
    // add it to the db.json file, and then return the new note to the client.
    // You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).
    .post((request, response) => {
        let db = JSON.parse(fs.readFileSync(`./${config.db}/db.json`));
        let userData = request.body
        db.push(userData);
        fs.writeFileSync(`./${config.db}/db.json`, JSON.stringify(db));
        console.log('attempting api post');
    });
// should receive a query parameter containing the id of a note to delete.
// In order to delete a note, you'll need to read all notes from the db.json file,
// remove the note with the given id property, and then rewrite the notes to the db.json file.
server.delete('/api/notes/:id', (request, response) => {
    console.log('attempting api delete');
    response.send('notes api delete')
});

// Index && Handle all non-specific requests (i.e. 404)
server.get('*', (request, response) => {
    let file = `${__dirname}/${config.root}/index.html`
    console.log('index: ' + file);
    response.sendFile(file);
});

// Start express server.
server.listen(config.port, () => {
    console.log(`Server started on port ${config.port}`);
});