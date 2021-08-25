const express = require("express");
const routes = require("./routes/routes");
const app = express();
const mongo = require("./modules/mongo")

app.listen(process.env.PORT || 80); // default port

app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);

app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");



async function main() {
	const db = await mongo();
	
	await app.use((req, res, next) => {
		req.db = db;
		next()
	})

	await routes(app)
}


main();