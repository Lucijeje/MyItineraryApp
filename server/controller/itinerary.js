const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/itinerary/getAbl");
const ListAbl = require("../abl/itinerary/listAbl");
const CreateAbl = require("../abl/itinerary/createAbl");
const UpdateAbl = require("../abl/itinerary/updateAbl");
const DeleteAbl = require("../abl/itinerary/deleteAbl");
const DownloadAbl = require("../abl/itinerary/downloadAbl");


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

router.get("/download", (req, res) => {
  DownloadAbl(req, res);
});

module.exports = router;