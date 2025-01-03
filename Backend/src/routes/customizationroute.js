import { Router } from "express";
import { getallCustomizations, saveCustomization } from "../controllers/productController.js";

const router = Router();

router.post("/customization", saveCustomization);
router.get("/all-customizations", getallCustomizations);

export default router;
