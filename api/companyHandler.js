const { Router } = require("express");
const Company = require("../models/company");
const Board = require("../models/board");
const { auth } = require("../middleware");
const router = Router();

//fetch all company
router.get("/", auth, async (req, res, next) => {
  try {
    const companyList = await Company.find({});
    res.json(companyList);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//fetch company by id
router.get("/:id", auth, async (req, res, next) => {
  const _id = req.params.id;
  try {
    const company = await Company.findOne({ _id });
    if (!company) return res.status(404).send();
    res.send(company);
  } catch (error) {
    next(error);
  }
});

//create new company
router.post("/", async (req, res, next) => {
  const { companyName, companyEmail, companyAddress } = req.body;
  try {
    if (!companyName || !companyEmail || !companyAddress)
      return res
        .status(400)
        .json({ msg: "Don't be lazy 🦥, enter all fields value" });
    const existingCompany = await Company.findOne({ companyName });
    const existingCompanyEmail = await Company.findOne({ companyEmail });
    if (existingCompany)
      return res.status(400).json({
        msg: "Company exists, please enter different company name ",
      });
    if (existingCompanyEmail)
      return res.status(400).json({
        msg: "Company Email exists, please enter different company name ",
      });

    const company = new Company(req.body);
    const respData = await company.save();
    res.send(respData);
  } catch (error) {
    if (error.name === "ValidationError") res.status(422);
    next(error);
  }
});

//delete company based on id
router.delete("/:id", auth, async (req, res, next) => {
  const _id = req.params.id;
  try {
    await Company.findOneAndDelete({ _id });
    Board.findOneAndUpdate({ company: _id }, { company: "" });
    const company = await Company.find({});
    res.send(company);
  } catch (error) {
    next(error);
  }
});

// update company content based on id
router.patch("/:id", auth, async (req, res, next) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "companyName",
    "companyEmail",
    "companyAddress",
    "companyLogo",
    "companyTeam",
  ];
  console.log("update?", updates);
  const isValidOperation = updates.every((update) => {
    console.log("update?", update);
    return allowedUpdates.includes(update);
  });
  console.log("isValidOperation?", isValidOperation);
  if (!isValidOperation)
    return res.status(400).send({ error: "Invalid updates!" });
  try {
    await Company.findOneAndUpdate({ _id }, req.body, {
      new: true,
      runValidators: true,
    });
    const company = await Company.find({});
    if (!company) return res.status(404).send({ error: "Company not found!" });
    res.send(company);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
