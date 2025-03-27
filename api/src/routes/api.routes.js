const { Router } = require ("express");
const ApiController = require("../controllers/ApiController");

/**
 * Initialize controller instance and router
 */
const apiController = new ApiController()
const apiRoutes = Router();

/**
 * Define route for scraping Amazon products
 * GET /api/scrape?keyword=yourKeyword
 */
apiRoutes.get("/scrape", apiController.showItem)

module.exports = apiRoutes;