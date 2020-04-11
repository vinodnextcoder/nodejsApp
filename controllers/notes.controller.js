const notesCtrl = {};
const Note = require("../models/Note");
const moment = require('moment');
var async = require("async");
const User = require('../models/User');
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
  async.waterfall([
    (callback) => { return callback(null, req.params); },
    myFirstFunction,
    mySecondFunction
  ], function (err, result) {
    res.render("notes/edit-note", { notes: result });
  });

};

notesCtrl.updateNote = (req, res) => {
  const { title, description, userid } = req.body;
  let obj = {
    "$addToSet": { "contributor": { "$each": [userid] } },
    "$set": {
      title, description
    }
  }
  Note.findByIdAndUpdate(req.params.id, obj)
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
notesCtrl.updateStatus = (req, res) => {
  // const { title, description } = req.body;
  Note.findByIdAndUpdate(req.params.id, { status: true })
    .then(note => {
      req.flash("success_msg", "Note Updated Successfully");
      res.redirect("/notes");
    }).catch(err => {
      req.flash("success_msg", "Note Updated Failed");
      return res.redirect("/notes");
    });
};
function myFirstFunction(data, callback) {
  Note.findById({ _id: data.id })
    .then(note => {
      callback(null, note)
    }).catch(err => {
      callback(null, [])
    });
}
function mySecondFunction(data, callback) {
  User.find({}, { name: 1 }).limit(2).lean()
    .then(users => {
      let obj = {
        note: data,
        user: users
      }
      callback(null, obj)
    }).catch(err => {
      let obj = {
        note: data,
        user: users
      }
      callback(null, obj)
    });
}
module.exports = notesCtrl;
