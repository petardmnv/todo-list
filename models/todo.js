const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const todoSchema = new Schema({
  record: { type: String, required: true },

  date: { type: Date, default: Date.now },
});

const model = mongoose.model("TodoModel", todoSchema);

module.exports = model;
