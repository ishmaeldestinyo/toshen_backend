import { Router } from "express";
import {
  confirmVerificationCredentialsController,
  getMyProfileController,
  loginController,
  resetPasswordSubmitController,
  sendVerificationCredentialsController,
  signUpController,
  updateMyProfileController,
} from "../controllers/userController.js";
import authGuard from "../middlewares/authGuard.js";

const userRouter = Router();

userRouter.post("/api/users", signUpController);
userRouter.get("/api/users/me", authGuard, getMyProfileController);
userRouter.post("/api/users/login", loginController);
userRouter.post(
  "/api/users/resetpassword/submit",
  resetPasswordSubmitController
);
userRouter.put("/api/users/me", authGuard, updateMyProfileController);
userRouter.post("/api/users/send", sendVerificationCredentialsController);
userRouter.post("/api/users/verify", confirmVerificationCredentialsController);

export default userRouter;
