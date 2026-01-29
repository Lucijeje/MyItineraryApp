const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/diaryEntry/getAbl");
const ListAbl = require("../abl/diaryEntry/listAbl");
const CreateAbl = require("../abl/diaryEntry/createAbl");
const UpdateAbl = require("../abl/diaryEntry/updateAbl");
const DeleteAbl = require("../abl/diaryEntry/deleteAbl");


router.get("/get", (req, res) => {
  GetAbl(req, res);
});

router.get("/list", (req, res) => {
  ListAbl(req, res);
});

router.post("/create", (req, res) => {
  CreateAbl(req, res);
});

router.post("/update", (req, res) => {
  UpdateAbl(req, res);
});

router.post("/delete", (req, res) => {
  DeleteAbl(req, res);
});



module.exports = router;