const Job = require("../models/job");
const { queryBuilder } = require("../controllers/jobController");

const getJobsLocations = async (req, res) => {
  const queryObject = queryBuilder(req.query);

  const locations = await Job.aggregate([
    {
      $match: {
        ...queryObject,
        location: { $exists: true, $ne: null, $ne: "" },
      },
    },
    {
      $group: {
        _id: "$location",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);
  return res.status(200).json({ locations });
};

const getJobsStatusCount = async (req, res) => {
  const queryObject = queryBuilder(req.query);

  const status = await Job.aggregate([
    {
      $match: {
        ...queryObject,
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);
  return res.status(200).json({ status });
};

const getJobsPerMonth = async (req, res) => {
  const stats = await Job.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$appliedAt" },
          month: { $month: "$appliedAt" },
        },
        pending: {
          $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
        },
        interview: {
          $sum: { $cond: [{ $eq: ["$status", "interview"] }, 1, 0] },
        },
        rejected: {
          $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] },
        },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
    {
      $project: {
        _id: 0,
        year: "$_id.year",
        month: "$_id.month",
        pending: 1,
        interview: 1,
        rejected: 1,
      },
    },
  ]);

  res.status(200).json({ stats });
};

module.exports = {
  getJobsLocations,
  getJobsStatusCount,
  getJobsPerMonth,
};
