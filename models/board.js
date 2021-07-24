const mongoose = require("mongoose");
const { Schema } = mongoose;

const boardSchema = new Schema(
  {
    projectName: {
      type: String,
      required: true,
    },
    projectDescription: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    pic: {
      type: Array,
      required: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "company",
      default: null,
      // required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    // image: {
    //     color: {
    //         type: String,
    //         required: true
    //     },
    //     thumb: {
    //         type: String,
    //     },
    //     full: {
    //         type: String,
    //     }
    // }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("board", boardSchema);
