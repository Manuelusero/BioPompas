import express from "express";
import { getOurStore, preloadOurStore } from "../controllers/ourStoreController.js";

const router = express.Router();

router.get("/", getOurStore);
router.post("/preload", preloadOurStore);

export default router;
