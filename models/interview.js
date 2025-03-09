const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Interview title is required"],
  },
  datetime: {
    type: Date,
    required: [true, "Interview date and time are required"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  jobAdvertisementId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: [true, "Job advertisement id is required"],
  },
});

module.exports = mongoose.model("Interview", interviewSchema);
