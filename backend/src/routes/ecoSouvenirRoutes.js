import express from "express";
import { getEcoSouvenirs, preloadEcoSouvenirs } from "../controllers/ecoSouvenirController.js";

const router = express.Router();

router.get("/", getEcoSouvenirs);
router.post("/preload", preloadEcoSouvenirs);

export default router;
