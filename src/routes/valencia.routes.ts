import { Router } from "express";
import * as valenciaController from "../controller/valencia.controller";

const router = Router();

router.get("/", valenciaController.getAll);
router.post("/", valenciaController.add);

export default router;
