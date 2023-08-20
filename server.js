const config = require('./config/config.json')
const express = require('express');
const bodyParser = require('body-parser')
const fs = require('fs');
const server = express();

// Use unix timestamp as ID
const idGenerator = () => {
    return Math.floor(Date.now() / 1000)
}

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: false }))

// List static files from root folder for use
server.use(express.static(config.root))

// Notes get request
server.get('/notes', (request, response) => {
    let file = `${__dirname}/${config.root}/notes.html`
    response.sendFile(file);
});

// Routes for /api/notes and optional :id param 
// get: request will read the db.json if it exists.
// post: will save user input to db.json.
// delete: will remove the note with the given id property, and then rewrite the notes to the db.json file.
server.route('/api/notes/:id?')
    .get((request, response) => {
        let file = `${__dirname}/${config.db}/db.json`;
        if (!fs.existsSync(file)) {
            fs.writeFileSync(file, '[\n]')
        }
        response.sendFile(file)
    })
    .post((request, response) => {
        let file = `./${config.db}/db.json`;
        let db = JSON.parse(fs.readFileSync(file));
        let userData = request.body;

        userData['id'] = idGenerator();
        db.push(userData);
        fs.writeFileSync(file, JSON.stringify(db, null, '\t'));
        response.send('Successfully updated db.json');
    })
    .delete((request, response) => {
        let file = `./${config.db}/db.json`;
        let db = JSON.parse(fs.readFileSync(file));
        let updatedDb = db.filter(entry => parseInt(entry.id) !== parseInt(request.params.id));

        fs.writeFileSync(file, JSON.stringify(updatedDb, null, '\t'));
        response.send('Note Successfully deleted.')
    });

// Index && Handle all non-specific requests (i.e. 404)
server.get('*', (request, response) => {
    let file = `${__dirname}/${config.root}/index.html`
    // console.log('index: ' + file);
    response.sendFile(file);
});

// Start express server.
server.listen(config.port, () => {
    console.log(`Server started on port ${config.port}`);
});