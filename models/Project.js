const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const projectSchema = new Schema({
	title: {
		type: String,
		required: true,
		trim: true,
	},
	github: {
		type: String,
		trim: true,
	},
	project_link: {
		type: String,
		trim: true,
	},
	description: {
		type: String,
		trim: true,
	},
	technology: [String],
	image: Buffer,
});

mongoose.model("projects", projectSchema);
