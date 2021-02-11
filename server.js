require("./models/Project");
const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");

const htmlRoutes = require("./routes/html-routes");
const apiRoutes = require("./routes/api-routes");
const keys = require("./config/keys");
const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(keys.mongoURI);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.engine("hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", "hbs");

app.use(htmlRoutes);
app.use(apiRoutes);

app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});
