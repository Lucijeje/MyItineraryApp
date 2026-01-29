const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/location/getAbl");
const ListAbl = require("../abl/location/listAbl");
const CreateAbl = require("../abl/location/createAbl");
const UpdateAbl = require("../abl/location/updateAbl");
const DeleteAbl = require("../abl/location/deleteAbl");

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