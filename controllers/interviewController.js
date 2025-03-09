const Interview = require("../models/interview");

const deleteInterview = async (req, res) => {
  const id = req.params.id;

  const interview = await Interview.findOneAndDelete({ _id: id });
  if (!interview) {
    throw new NotFoundError(`No interview with id ${id}`);
  }
  res.status(200).json({ msg: "Success" });
};

const createInterview = async (req, res) => {
  const interview = await Interview.create(req.body);
  res.status(200).json({ interview });
};

const getAllInterviews = async (req, res) => {
  const now = new Date();
  let interviews = await Interview.find()
    .populate({ path: "jobAdvertisementId", select: "advertiser" })
    .sort({ datetime: -1 });

  interviews = interviews.map((interview) => {
    const obj = interview.toObject();
    obj.advertiser = obj.jobAdvertisementId?.advertiser;
    delete obj.jobAdvertisementId;
    return obj;
  });

  res.status(200).json({ interviews });
};

module.exports = {
  createInterview,
  deleteInterview,
  getAllInterviews,
};
