import { Router } from "express";
import { message } from "../controllers/messages.controller.js";

const router = Router();

router.post("/", message);

export { router as messageRouter };
