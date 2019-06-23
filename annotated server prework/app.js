// Import express for initial express setup.
const express = require("express");
const app = express();

/** "Cross-Origin Resource Sharing" allows the use of additional
 * HTTP headers to tell a browser to let a web application access
 * resources from a server at a different origin. **/
const cors = require("cors");
app.use(express.json());
app.use(cors());

// Import shortid package which generates unique ids.
const ids = require("shortid");

// Tells the server which port to run on.
app.set("port", process.env.PORT || 3000);


// Array where all our notes will be saved on the server.
app.locals.notes = [];

/** HTTP GET method which returns a json version of all 
notes stored in app.locals.notes and a status code of 200. **/
app.get("/api/v1/notes", (request, response) => {
  const notes = app.locals.notes;
  return response.status(200).json(notes);
});

/** HTTP GET method which returns a json version of a specific note
 * stored in app.locals.notes with a specified id and a status code of 200. **/
app.get("/api/v1/notes/:id", (request, response) => {
  const { id } = request.params;
  const notes = app.locals.notes;

  /** Iterates through the array of notes stored on the server and
   * returns the note thats id matches the id passed through.  **/
  const note = notes.find(note => note.id == id);

  if (!note)
    /** If there isn't a note thats id matches the id passed through
     * then a status code of 404 is returned along with a message saying
     * that there wasn't a note found with the id being passed through. **/
    return response.status(404).json({ Error: `No note found with ${id}` });
  /** If a note thats id matches the id passed through then a
   * status code of 200 is returned along with that specific note. **/
  return response.status(200).json(note);
});

// HTTP POST method which posts a new note to the app.local.notes array.
app.post("/api/v1/notes/", (request, response) => {
  const { notes } = app.locals;
  const { title, list } = request.body;

  /** If the new note doesn't include either a title or list item a status
   *  code of 422 is returned along with a message explaining what the expected
   * format should be. **/
  if (!title || !list)
    return response
      .status(422)
      .json("Expected format: { title: <String>, list: <StringArray> }");
  // Creates new note with correct format.
  const newlist = {
    id: ids.generate(),
    title,
    list
  };

  // Pushes new note into app.local.notes array
  notes.push(newlist);
  // Returns status code of 201 along with new note.
  return response.status(201).json(newlist);
});

/** HTTP PUT method which updates a note it app.locals.notes
 * with a specified id that is passed through. **/
app.put("/api/v1/notes/:id", (request, response) => {
  const { title, notes } = request.body;
  let { id } = request.params;

  /** Iterates through the array of notes stored on the server and
   * returns the note thats id matches the id passed through.  **/
  const foundNote = app.locals.notes.find(note => note.id == id);

  if (!foundNote)
    /** If there isn't a note thats id matches the id passed through
     * then a status code of 404 is returned along with a message saying
     * that there wasn't a note found with the id being passed through. **/
    return response.status(404).json({ Error: `No note found with ${id} ` });
  if (!title || !notes)
    /** If the new note doesn't include either a title or list item a status
     *  code of 422 is returned along with a message explaining what the expected
     * format should be. **/
    return response.status(422).json({
      Error: `Expected format: { title: <String>, notes: <Stringarray> }`
    });

  // Replaces app.locals.notes note title with title passed through.
  foundNote.title = title;
  // Replaces app.locals.notes note list item with list item passed through.
  foundNote.list = notes;
  // Returns a status code of 204 along with the entire app.locals.notes array.
  return response.sendStatus(204).json(app.locals.notes);
});

// HTTP DELETE method that deletes a note from app.locals.notes with a specified id.
app.delete("/api/v1/notes/:id", (request, response) => {
  const { notes } = app.locals;
  const { id } = request.params;

  /** Iterates through the array of notes stored on the server and
   * returns the note thats id matches the id passed through.  **/
  const noteIndex = notes.findIndex(note => note.id == id);

  if (noteIndex === -1)
    /** If there isn't a note thats id matches the id passed through
     * then a status code of 404 is returned along with a message saying
     * that there wasn't a note found with the id being passed through. **/
    return response.status(404).json({ Error: `No note found with ${id}` });

  // Removes the note with the specified id from the array of app.locals.notes
  notes.splice(noteIndex, 1);
  // Returns a status code of 200 along with message saying that the note was successfully deleted.
  return response.sendStatus(200).json("Note was successfully deleted");
});

// Exports app
module.exports = app;
