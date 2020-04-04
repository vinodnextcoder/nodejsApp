const notesCtrl = {};
const Note = require("../models/Note");
const moment = require('moment');
notesCtrl.renderNoteForm = (req, res) => {
  res.render("notes/new-note");
};
notesCtrl.createNewNote = (req, res) => {
  const { title, description } = req.body;
  const errors = [];
  if (!title || !description) {
    errors.push({ text: "Please fill all fields." });
  }
  if (errors.length > 0) {
    res.render("notes/new-note", {
      errors,
      title,
      description
    });
  }
  else {
    const newNote = new Note({ title, description });
    newNote.user = req.user.id;
    newNote.save()
      .then(notes => {
        req.flash("success_msg", "Note Added Successfully");
        res.redirect("/notes");
      }).catch(err => {
        res.redirect("/notes");
      });
  }
};
notesCtrl.renderNotes = (req, res) => {
  Note.find()
    .then(notes => {
      notes.forEach(function (item) {
        var date = moment(item.createdAt, "YYYYMMDD").fromNow();
        item.date = date
      });
      res.render("notes/all-notes", { notes });
    }).catch(err => {
      res.status(500).send({
        message: err.message
      });
    });
};
notesCtrl.renderEditForm = (req, res) => {
  Note.findById(req.params.id)
    .then(note => {
      if (note.user != req.user.id) {
        req.flash("error_msg", "Not Authorized");
        return res.redirect("/notes");
      }
      res.render("notes/edit-note", { note });
    }).catch(err => {
      req.flash("error_msg", "Not Authorized");
      return res.redirect("/notes");
    });
};
notesCtrl.updateNote = (req, res) => {
  const { title, description } = req.body;
  Note.findByIdAndUpdate(req.params.id, { title, description })
    .then(note => {
      req.flash("success_msg", "Note Updated Successfully");
      res.redirect("/notes");
    }).catch(err => {
      req.flash("success_msg", "Note Updated Failed");
      return res.redirect("/notes");
    });
};
notesCtrl.deleteNote = (req, res) => {
  Note.findByIdAndDelete(req.params.id)
    .then(note => {
      req.flash("success_msg", "Note Deleted Successfully");
      res.redirect("/notes");
    }).catch(err => {
      req.flash("success_msg", "Note Deleted Failed");
      return res.redirect("/notes");
    });
};
module.exports = notesCtrl;
