import express from "express";
import { getTopPicks, preloadTopPicks } from "../controllers/topPickController.js";

const router = express.Router();

router.get("/", getTopPicks);
router.post("/preload", preloadTopPicks);

export default router;
