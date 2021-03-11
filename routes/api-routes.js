const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const sharp = require("sharp");
const _ = require("lodash");

const router = new express.Router();
const Project = mongoose.model("projects");

const upload = multer({
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
			return cb(new Error("File must be jpg, jpeg, or png"));
		}

		cb(undefined, true);
	},
});

router.post("/api/portfolio", upload.single("image"), async (req, res) => {
	const { title, github, project_link, description } = req.body;
	const technology = Object.keys(req.body)
		.slice(4)
		.map(tech => _.capitalize(tech));
	let image;

	try {
		if (req.file) {
			image = await sharp(req.file.buffer)
				.resize({ width: 375 })
				.png()
				.toBuffer();
		}

		const project = new Project({
			title,
			github,
			project_link,
			description,
			technology,
			image,
		});

		project.save();
		res.status(201).send(project);
	} catch (e) {
		res.status(500).send(`Error: ${e.message}`);
	}
});

router.get("/api/portfolio", async (req, res) => {
	try {
		const projects = await Project.find({});

		res.send(projects);
	} catch (e) {
		res.status(500).send(`Error: ${e.message}`);
	}
});

router.patch("/api/portfolio/:id", upload.single("image"), async (req, res) => {
	const _id = req.params.id;
	const updates = req.body;
	let image;

	try {
		if (req.file) {
			image = await sharp(req.file.buffer)
				.resize({ width: 375 })
				.png()
				.toBuffer();

			await Project.updateOne({ _id }, { $set: { image } });
		}

		let technology = [];

		_.forEach(updates, async (entry, entryKey) => {
			if (entryKey.includes("edit")) {
				const property = entryKey.replace("edit-", "");
				technology.push(_.capitalize(property));
			} else if (entry) {
				await Project.updateOne({ _id }, { $set: { [entryKey]: entry } });
			}
		});

		if (technology.length) {
			await Project.updateOne({ _id }, { $set: { technology } });
		}

		res.send();
	} catch (e) {
		res.status(500).send(`Error: ${e.message}`);
	}
});

router.delete("/api/portfolio/:id", async (req, res) => {
	const _id = req.params.id;

	try {
		const project = await Project.findOneAndDelete({ _id });

		if (!project) {
			return res.status(404).send();
		}

		res.send(project);
	} catch (e) {
		res.status(500).send(`Error: ${e.message}`);
	}
});

module.exports = router;
