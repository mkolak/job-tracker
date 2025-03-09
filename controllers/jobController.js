const { NotFoundError } = require("../errors");
const Job = require("../models/job");

const queryBuilder = (fields) => {
  const { advertisement, advertiser, location, status, startDate, endDate } =
    fields;

  const queryObject = {};

  if (advertiser)
    queryObject.advertiser = { $regex: advertiser, $options: "i" };

  if (location) queryObject.location = { $in: location.split("+") };

  if (status) queryObject.status = { $in: status.split(",") };

  if (advertisement)
    queryObject.advertisement = { $regex: advertisement, $options: "i" };

  if (startDate || endDate) {
    queryObject.appliedAt = {};
    if (startDate) queryObject.appliedAt.$gte = new Date(startDate);
    if (endDate) queryObject.appliedAt.$lte = new Date(endDate);
  }

  return queryObject;
};

const getAllJobs = async (req, res) => {
  const {
    advertisement,
    advertiser,
    location,
    status,
    sort,
    fields,
    startDate,
    endDate,
  } = req.query;

  const queryObject = queryBuilder({
    advertisement,
    advertiser,
    location,
    status,
    startDate,
    endDate,
  });

  let result = Job.find(queryObject);

  if (sort) {
    const sortList = [...sort.split(","), "_id"].join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("-appliedAt _id");
  }

  if (fields) {
    const fieldsList = fields.split(",").join(" ");
    result = result.select(fieldsList);
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit);

  const [jobs, totalJobs] = await Promise.all([
    result,
    Job.countDocuments(queryObject),
  ]);
  return res.status(200).json({
    jobs,
    nbHits: totalJobs,
    currentPage: page,
    nextPage: jobs.length < 10 ? null : page + 1,
  });
};

const getSingleJob = async (req, res) => {
  const id = req.params.id;

  let job = await Job.findOne({ _id: id }).populate("interviews");

  if (!job) {
    throw new NotFoundError(`No job with id ${id}`);
  }

  res.status(200).json({ job });
};

const editJob = async (req, res) => {
  const id = req.params.id;

  const job = await Job.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!job) {
    throw new NotFoundError(`No job with id ${id}`);
  }

  res.status(200).json({ job });
};

const deleteJob = async (req, res) => {
  const id = req.params.id;

  const job = await Job.findOneAndDelete({ _id: id });
  if (!job) {
    throw new NotFoundError(`No job with id ${id}`);
  }
  res.status(200).json({ msg: "Success" });
};

const createJob = async (req, res) => {
  const job = await Job.create(req.body);
  res.status(200).json({ job });
};

module.exports = {
  getAllJobs,
  getSingleJob,
  createJob,
  editJob,
  deleteJob,
  queryBuilder,
};
