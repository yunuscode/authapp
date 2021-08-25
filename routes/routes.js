const HomeRoute = require("./HomeRoute");

module.exports = async function (app) {
	app.use(HomeRoute.path, HomeRoute.router);
};
