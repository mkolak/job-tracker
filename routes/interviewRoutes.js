const express = require("express");
const router = express.Router();

const {
  createInterview,
  deleteInterview,
  getAllInterviews,
} = require("../controllers/interviewController");

router.route("/").post(createInterview).get(getAllInterviews);
router.route("/:id").delete(deleteInterview);

module.exports = router;
