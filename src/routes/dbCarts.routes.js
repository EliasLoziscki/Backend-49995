import express from "express";
import { cartByID, getCartsAll, postCreateCarts, postAddProductToCart, updateCartId, updateCartIdByProduct, deleteCartById, deleteProductItCartById } from "../controllers/dbCarts.controller.js";

const router = express.Router();

router.post("/", postCreateCarts);

router.get("/", getCartsAll);

router.get("/:cid", cartByID);

router.post("/:cid/products/:pid", postAddProductToCart);

router.put("/:cid", updateCartId);

router.put("/:cid/products/:pid", updateCartIdByProduct);

router.delete("/:cid", deleteCartById);

router.delete("/:cid/products/:pid", deleteProductItCartById);

export { router as dbCartRouter };