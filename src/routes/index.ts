import { debug } from "console";
import { Router, Request, Response } from "express";
import { readdirSync } from "fs";

const router = Router();

const removeExtension = (fileName) => {
  return fileName.split(".").shift();
};

debug("\n===== Loading routes =====");

// Home page
debug(`  - / -> Home`);
router.get("/", (req: Request, res: Response) => {
  res
    .status(200)
    .header("Content-Type", "text/html")
    .send(`<h4>🙌 RESTful API PIN 👀</h4>`);
});

readdirSync(__dirname).filter((file) => {
  const fileWithOutExt = removeExtension(file);
  const skip = ["index"].includes(fileWithOutExt);
  if (!skip) {
    debug(`  - /${fileWithOutExt}`);
    router.use(
      `/${fileWithOutExt}`,
      require(`./${fileWithOutExt}.routes`).default
    );
  }
});

// Error 404
debug(`  - * -> 404`);
router.get("*", (req: Request, res: Response) => {
  return res.status(404).json("404 Not Found");
});

export default router;
