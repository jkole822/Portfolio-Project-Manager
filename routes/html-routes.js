const express = require("express");
const mongoose = require("mongoose");
const router = new express.Router();
const Project = mongoose.model("projects");

router.get("/", async (req, res) => {
	const projects = await Project.find({}).lean();

	res.render("index", { projects });
});

module.exports = router;
