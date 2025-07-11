import express from "express";
import { getCategories, preloadCategories } from "../controllers/categoryController.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/preload", preloadCategories);

export default router;
