import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

console.log("UPLOAD TYPE:", typeof upload.fields); // 👈 ADD HERE

router.post(
  "/register",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  (req, res, next) => {
    console.log("🔵 BEFORE asyncHandler, next type:", typeof next);
    next();
  },
  asyncHandler(registerUser),
);

export default router;
