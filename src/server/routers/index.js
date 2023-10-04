const express = require("express");
const { signUp, signIn } = require("../controllers/user");

const router = express.Router();
/* GET home page. */
router.get("/", function (req, res, next) {
  res.json({ result: "index" });
});

router.post("/register", signUp);

router.post("/login", signIn);

module.exports = router;
