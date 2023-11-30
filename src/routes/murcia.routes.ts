import { Router } from "express";
import * as murciaController from "../controller/murcia.controller";

const router = Router();

router.get("/", murciaController.getAll);
router.post("/", murciaController.add);

export default router;
