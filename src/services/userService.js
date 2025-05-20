import { UserModel, UserStatus } from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";

export const signUpService = async (req, res, next) => {
  // sign up user
  const { email, password } = req.body;

  try {
    if (!email || !validator.isEmail(email))
      return res
        .status(400)
        .json({ success: false, message: "Invalid email address" });

    if (!password || password.length <= 6)
      return res
        .status(400)
        .json({ success: false, message: "Password strength is required" });

    const newAccount = await UserModel({ email, password });

    await newAccount.checkDuplicate();

    await newAccount.hashPassword();

    const savedAccount = await newAccount.save();

    return res.status(201).json({
      success: true,
      message: "Account successfully created!",
      data: savedAccount,
    });
  } catch (error) {
    let status = error.status || 500;

    return res.status(status).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

export const loginService = async (req, res, next) => {
  // login user
  const { email, password } = req.body;

  if (!email || !validator.isEmail(email))
    return res
      .status(400)
      .json({ success: false, message: "Invalid email address" });


  try {
    const account = await UserModel.findOne({ email }).select("+password");

    if (!account)
      return res
        .status(404)
        .json({ success: false, message: "Account not found!", data: null });

    const passwordMatched = await account.comparePassword(password);

    if (!passwordMatched)
      return res.status(400).json({
        success: false,
        message: "Both email and password does not match!",
        data: null,
      });

    const accessToken = await account.signJwt();

    return res.status(200).json({
      success: true,
      message: "Login successfully!",
      data: { accessToken, account },
    });
  } catch (error) {
    let status = error.status || 500;

    return res.status(status).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

export const getMyProfileService = async (req, res, next) => {
  const authUser = req?.user;
  return res.status(200).json({
    success: true,
    message: "Profile successfully retrieved",
    data: authUser,
  });
};

export const updateMyProfileService = async (req, res, next) => {
  try {
    const authUser = req?.user;

    const {
      email,
      password,
      fullname,
      address,
      date_of_birth,
      gender,
      phone_number,
      next_kin_of_kin_fullname,
      next_kin_of_kin_contact_address,
      next_kin_of_kin_contact_number,
      next_kin_of_kin_contact_email,
    } = req.body;

    if (next_kin_of_kin_fullname) {
      authUser["next_of_kin"]["fullname"] = next_kin_of_kin_fullname;
    }
    if (next_kin_of_kin_contact_address) {
      authUser["next_of_kin"]["contact_address"] =
        next_kin_of_kin_contact_address;
    }
    if (next_kin_of_kin_contact_number) {
      authUser["next_of_kin"]["contact_number"] =
        next_kin_of_kin_contact_number;
    }
    if (next_kin_of_kin_contact_email) {
      authUser["next_of_kin"]["contact_email"] = next_kin_of_kin_contact_email;
    }

    if (email) {
      if (!email || !validator.isEmail(email))
        return res
          .status(400)
          .json({ success: false, message: "Invalid email address" });

      authUser["email"] = email;
    }
    if (phone_number) {
      authUser["phone_number"] = phone_number;
    }
    if (fullname) {
      authUser["fullname"] = fullname;
    }
    if (address) {
      authUser["address"] = address;
    }

    if (date_of_birth) {
      authUser["date_of_birth"] = date_of_birth;
    }

    if (gender) {
      authUser["gender"] = gender;
    }

    if (password) {
      if (!password || password.length <= 6)
        return res
          .status(400)
          .json({ success: false, message: "Password strength is required" });

      authUser["password"] = bcrypt.hashSync(password);
    }

    const savedAuthUser = await authUser.save();

    savedAuthUser["password"] = null;

    return res.status(200).json({
      success: true,
      message: "Profile successfully updated!",
      data: savedAuthUser,
    });
  } catch (error) {
    return res
      .status(error?.status || 500)
      .json({ success: false, message: error?.message });
  }
};

export const sendVerificationCredentialsService = async (req, res, next) => {
  const { email } = req.body;
  try {
    if (!email || !validator.isEmail(email))
      return res
        .status(400)
        .json({ success: false, message: "Invalid email address" });

    const account = await UserModel.findOne({ email }).exec();

    if (!account)
      return res
        .status(404)
        .json({
          success: false,
          message: "You'll recieve a follow-up mail if an account exist!",
          data: null,
        });

    if (
      account.status != UserStatus.ACTIVE &&
      account.status != UserStatus.UNCONFIRMED
    )
      return res.status(403).json({
        success: false,
        message: `Sorry! Associated account with this email has been ${account.status.toLowerCase()}. Please contact administrator!`,
      });

    const { otp, expiry, token } = await account.generateCredentials();

    account.auth_otp = otp;
    account.auth_expiry = expiry;
    account.auth_token = token;

    await account.save();

    await account.sendConfirmationEmail(otp, expiry, token);

    return res
      .status(200)
      .json({
        success: true,
        message:
          "You'll recieve a follow-up mail if an account exist wit this email!",
      });
  } catch (error) {
    return res
      .status(error?.status || 500)
      .json({ success: false, message: error?.message });
  }
};

export const confirmVerificationCredentialsService = async (req, res, next) => {
  try {
    const token = req?.query?.data;

    if (!token)
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });

    const account = await UserModel.findOne({
      $or: [{ auth_token: token }, { auth_otp: token }],
    }).exec();

    if (!account)
      return res
        .status(404)
        .json({
          success: false,
          message: "Invalid or expired token",
          data: null,
        });

    if (
      !account.auth_expiry ||
      new Date(account.auth_expiry).getTime() <= Date.now()
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token!",
      });
    }

    account.auth_otp = null;
    account.auth_expiry = null;
    account.auth_token = null;

    account.status = UserStatus.ACTIVE;

    await account.save();

    return res
      .status(200)
      .json({ success: true, message: "Account successfully verified!" });
  } catch (error) {
    return res
      .status(error?.status || 500)
      .json({ success: false, message: error?.message });
  }
};

export const resetPasswordSubmitService = async (req, res, next) => {
  try {
    const token = req?.query?.data;

    const { password } = req.body;

    if (!password || password.length <= 6)
      return res
        .status(400)
        .json({ success: false, message: "Password strength is required" });

    if (!token)
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });

    const account = await UserModel.findOne({
      $or: [{ auth_token: token }, { auth_otp: token }],
    })
      .select("+password")
      .exec();

    if (!account)
      return res
        .status(404)
        .json({
          success: false,
          message: "Invalid or expired token",
          data: null,
        });

    if (
      !account.auth_expiry ||
      new Date(account.auth_expiry).getTime() <= Date.now()
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token!",
      });
    }

    account.auth_otp = null;
    account.auth_expiry = null;
    account.auth_token = null;

    account.password = bcrypt.hashSync(password);

    await account.save();

    return res
      .status(200)
      .json({ success: true, message: "Password successfully reseted!" });
  } catch (error) {
    return res
      .status(error?.status || 500)
      .json({ success: false, message: error?.message });
  }
};
