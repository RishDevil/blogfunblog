const express = require("express");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, "blog" + "-" + Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  cb(null, true);
};

let upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

const router = express.Router();

router.post("/", upload.single("image"), (req, res) => {
  console.log("imagesss");
  res.send(`/${req.file.path}`);
});
module.exports = router;
