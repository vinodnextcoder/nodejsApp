const express = require("express");
const router = express.Router();

// Controller
const {
  renderNoteForm,
  createNewNote,
  renderNotes,
  renderEditForm,
  updateNote,
  deleteNote,
  updateStatus,
  renderNotesgrids
} = require("../controllers/notes.controller");

// Helpers
const { isAuthenticated } = require("../helpers/auth");

// New Note
router.get("/notes/add", isAuthenticated, renderNoteForm);

router.post("/notes/new-note", isAuthenticated, createNewNote);

// Get All Notes
router.get("/notes", isAuthenticated, renderNotes);

// router.get("/demo", isAuthenticated, renderNotes);

// Edit Notes
router.get("/notes/edit/:id",isAuthenticated, renderEditForm);

router.put("/notes/edit-note/:id", isAuthenticated, updateNote);

// Delete Notes
router.delete("/notes/delete/:id", isAuthenticated, deleteNote);
// update task completed
router.post("/notes/statusUpdate/:id", isAuthenticated, updateStatus);

router.get("/notesgrid", isAuthenticated, renderNotesgrids);

module.exports = router;
