const mongoose = require("mongoose");
const { Schema } = mongoose;

const cardSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      required: true,
    },
    pic: {
      type: Array,
    },
    listId: {
      type: Schema.Types.ObjectId,
      ref: "list",
      required: true,
    },
    boardId: {
      type: Schema.Types.ObjectId,
      ref: "board",
      required: true,
    },
    order: {
      type: String,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    list: {
      type: Array,
    },
    modifyBy: {
      type: String,
    },
    modifyDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("card", cardSchema);
