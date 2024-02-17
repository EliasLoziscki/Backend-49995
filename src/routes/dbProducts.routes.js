import express from "express";
import { ProductById, deleteProductById, getProductsAll, postCreateProduct, updateProductById } from "../controllers/dbProducts.controller.js";

const router = express.Router();

router.get("/", getProductsAll);

router.post("/", postCreateProduct);

router.get("/:pid", ProductById);

router.put("/:pid", updateProductById);

router.delete("/:pid", deleteProductById);

export { router as dbProductRouter };