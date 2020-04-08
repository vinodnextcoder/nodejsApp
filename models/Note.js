const { Schema, model } = require("mongoose");

const NoteSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    user: {
      type: String,
      required: true
    },
    status: {
      type: Boolean,
      default:false
    },
    approval: {
      type: Boolean,
      default:false
    }
  },
  {
    timestamps: true
  }
);

module.exports = model("Note", NoteSchema);
