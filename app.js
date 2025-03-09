require("dotenv").config();
require("express-async-errors");

const express = require("express");
const path = require("path");

const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

const app = express();
app.use(express.static(path.join(__dirname, "dist")));

const notFoundMiddleware = require("./middleware/not-found");
const errorMiddleware = require("./middleware/error-handler");
const connectDB = require("./db/connect");

const jobsRouter = require("./routes/jobRoutes");
const interviewsRouter = require("./routes/interviewRoutes");
const statsRouter = require("./routes/statsRoutes");

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

app.use("/api/v1/jobs", jobsRouter);
app.use("/api/v1/interviews", interviewsRouter);
app.use("/api/v1/stats", statsRouter);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 8000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Server listening on PORT ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
