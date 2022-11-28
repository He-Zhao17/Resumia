const applicantRoutes = require("./applicants");
const hrRoutes = require("./hrs");
const routesAPI = require("./routesAPI");

const constructorMethod = (app) => {
  app.use("/", routesAPI); // for register and log in
  app.use("/applicant", applicantRoutes);
  app.use("/hr", hrRoutes);
  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

module.exports = constructorMethod;
