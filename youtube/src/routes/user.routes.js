import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { logoutUser } from "../controllers/user.controller.js";

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

router.route("/login").post(loginUser)

//secure routes
router.route("/logout").post(authMiddleware, logoutUser)

export default router;
