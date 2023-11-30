import { Router } from "express";
import * as catulaController from "../controller/cataluna.controller";

const router = Router();

router.get("/", catulaController.getAll);
router.post("/", catulaController.add);

export default router;
