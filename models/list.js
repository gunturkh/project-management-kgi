const mongoose = require("mongoose");
const { Schema } = mongoose;

const listSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    pic: {
      type: Array,
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("list", listSchema);
