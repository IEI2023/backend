import { Router } from "express";
import * as generalController from "../controller/general.controller";

const router = Router();

router.post("/", generalController.get);

export default router;
