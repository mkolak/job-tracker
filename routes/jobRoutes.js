const express = require("express");
const router = express.Router();

const {
  getAllJobs,
  getSingleJob,
  createJob,
  editJob,
  deleteJob,
} = require("../controllers/jobController");

router.route("/").get(getAllJobs).post(createJob);

router.route("/:id").get(getSingleJob).delete(deleteJob).patch(editJob);

module.exports = router;
