import { Router } from "express";
import * as murciaController from "../controller/murcia.controller";

const router = Router();

router.post("/", murciaController.getAll);
router.post("/add", murciaController.add);

export default router;
