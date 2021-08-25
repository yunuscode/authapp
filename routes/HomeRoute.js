const router = require("express").Router();
const expressFileUpload = require("express-fileupload");
const path = require("path");
const hashPassword = require("../modules/bcrypt");

router.get("/", (req, res) => {
	res.render("index");
});

router.get("/:username", async (req, res) => {
	const user = await req.db.users.findOne({
		username: req.params.username,
	});

	if (user) {
		res.render("profile", {
			user: user,
		});
	} else {
		res.render("404");
	}
});

router.get("/signup", (req, res) => {
	res.render("signup");
});

router.post(
	"/signup",
	expressFileUpload(["avatar", "resume"]),
	async (req, res) => {
		const oldUser = await req.db.users.findOne({
			$or: [
				{
					email: req.body.email,
				},
				{
					username: req.body.username,
				},
			],
		});

		if (oldUser) {
			res.render("signup", {
				error: "Username or Email already exists",
			});
		}

		const avatarName =
			req.files.avatar.md5 +
			"." +
			req.files.avatar.name.split(".")[
				req.files.avatar.name.split(".").length - 1
			];

		req.files.avatar.mv(
			path.join(__dirname, "..", "public", "avatars", avatarName)
		);

		const resumeName =
			req.files.resume.md5 +
			"." +
			req.files.resume.name.split(".")[
				req.files.resume.name.split(".").length - 1
			];

		req.files.resume.mv(
			path.join(__dirname, "..", "public", "resumes", resumeName)
		);

		const newUser = await req.db.users.insertOne({
			email: req.body.email,
			username: req.body.username,
			password: await hashPassword(req.body.password),
			resume: resumeName,
			avatar: avatarName,
		});

		res.redirect("/");
	}
);

module.exports = {
	path: "/",
	router,
};
