const express = require("express");
const router = express.Router();

const {
  getJobsLocations,
  getJobsStatusCount,
  getJobsPerMonth,
} = require("../controllers/statsController");

router.route("/locations").get(getJobsLocations);
router.route("/status").get(getJobsStatusCount);
router.route("/monthly").get(getJobsPerMonth);

module.exports = router;
