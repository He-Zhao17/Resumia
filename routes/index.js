const applicantRoutes = require("./applicants");
const hrRoutes = require("./hrs");
const routesAPI = require("./routesAPI");
const jobPostRoutes = require("./jobPost");
const applicationRoutes = require("./applications");
const path = require('path');
const constructorMethod = (app) => {
  app.use("/", routesAPI); // for register and log in
  app.use("/applicant", applicantRoutes);
  app.use("/hr", hrRoutes);
  app.use("/jobPost", jobPostRoutes);
  app.use("/applications", applicationRoutes);
  app.get('/aboutus', (req, res) => {
    res.sendFile(path.resolve('static/index.html'));
  });
  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

module.exports = constructorMethod;
