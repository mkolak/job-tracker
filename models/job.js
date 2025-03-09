const mongoose = require("mongoose");
require("./interview");

const jobSchema = new mongoose.Schema({
  advertisement: {
    type: String,
    required: [true, "Advertisement name must be provided"],
  },
  advertiser: {
    type: String,
    required: [true, "Advertiser name must be provided"],
  },
  advertiserWebsite: {
    type: String,
    required: false,
  },
  location: {
    type: String,
    required: false,
  },
  advertisementUrl: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "interview", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  appliedAt: {
    type: Date,
    default: Date.now(),
  },
});

jobSchema.virtual("interviews", {
  ref: "Interview",
  localField: "_id",
  foreignField: "jobAdvertisementId",
});

jobSchema.pre("findOneAndDelete", async function (next) {
  const job = await this.model.findOne(this.getQuery());
  if (job) {
    await mongoose
      .model("Interview")
      .deleteMany({ jobAdvertisementId: job._id });
  }
  next();
});

jobSchema.set("toObject", { virtuals: true });
jobSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Job", jobSchema);
