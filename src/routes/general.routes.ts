import { Router } from "express";
import * as generalController from "../controller/general.controller";

const router = Router();

router.get("/", generalController.getAll);
router.post("/", generalController.get);

export default router;
