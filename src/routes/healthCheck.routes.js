import { Router } from "express";
import { healthcheck } from "../controllers/healthCheck.controller.js";
const healthCheckRouter=Router();

healthCheckRouter.route("/").get(healthcheck);

export default healthCheckRouter;