import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/claudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

// genrating access and refresh tokens
const generateAccessAndRefreshTokens = async (user_id) => {
  try {
    console.log("USER _id:", userId);

    const user = await User.findById(userId);

    console.log("USER:", user);

    if (!user) {
      throw new Error("User not found");
    }

    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();

    console.log("TOKENS GENERATED");

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    console.log("USER SAVED");

    return { accessToken, refreshToken };

  } catch (error) {
    console.log("FULL ERROR:", error);

    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access tokens"
    );
  }
};

// Register controller
const registerUser = async (req, res) => {
  // console.log("✅ registerUser HIT");
  // console.log("BODY:", req.body);
  // console.log("FILES:", req.files);
  const { fullname, email, username, password } = req.body || {};

  if (
    [fullname, email, username, password].some(
      (field) => !field || field.trim() === "",
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existUser) {
    throw new ApiError(409, "User with email or username already exists");
  }
  // console.log(req.files);

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  // console.log("🟢 avatar done");
  const coverImage = coverImageLocalPath
    ? await uploadOnCloudinary(coverImageLocalPath)
    : null;

  if (!avatar) {
    throw new ApiError(500, "Avatar upload failed");
  }
  // console.log("🟢 coverImage done:", coverImage);

  const user = await User.create({
    fullname,
    email,
    password,
    username: username.toLowerCase(),
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });
  // console.log("🟢 user created:", user._id);

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );
  // console.log("🟢 createdUser:", createdUser);

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
};

// Login controller
const loginUser = async (req, res) => {
  // req body -> data
  // username or email
  // find the username
  // password check
  // access and refresh tokecn generate
  // send cookie and response

  const { email, username, password } = req.body || {};
  console.log(email, username, password);

  if (!(email || username)) {
    throw new ApiError(400, "Email or username is required");
  }
  const user = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }
  console.log("🟢 User authenticated:", user._id);
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );
  console.log("🟢 Tokens generated:", { accessToken, refreshToken });

  // optional: set cookie
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  console.log(loggedInUser);

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully",
      ),
    );
};

// Logout controller,
const logoutUser = async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      returnDocument: "after",
    },
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, null, "User logged out successfully"));
};

    // RefreshAccess Token
const refreshTokens = async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401,  "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    )
  
    const user = await User.findById(decodedToken._id)
  
      if (!user) {
      throw new ApiError(401,  "Invalid refresh token - user not found");
    }
  
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, " refresh token is expired or used");
    }
  
    const options = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id);
  
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Tokens refreshed successfully",
        ),
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
}

    //Change Password 
const changeCurrentPassword = async(req, res) => {
  const {oldPasword, newPassword} = req.body
  const user = await User.findById(req.user?._id)
  const isPasswordCorrect = await user.isPasswordCorrect(oldPasword)

  if(!isPasswordCorrect){
    throw new ApiError(400, "Password is Incorrect")
  }

  user.password = newPassword
  await user.save({validateBeforeSave: false})

  return res
  .status(200)
  .json(new ApiResponse(200, null, "Passwor changed successfully"))
};



// getCurrent User
const getCurrentUser = async(req, res) => {
  return res
  .status(200)
  .json(new ApiResponse(200, req.user, "current user fatch successfully"))
};

// updateAccountDetails
const updateAccountDetails = async (req, res) => {
  const {fullname, email} = req.body

  if(!fullname || !email){
    throw new ApiError(200, "All fields are required")
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullname: fullname,
        email
      }
    },
    {new: true}
  ).select("-Password")

  return res
  .status(200)
  .json(new ApiResponse(200, user, "Account details updated successfully"))
   
};


// avatar updated
const updateAvatarUser = async ( req, res) =>  {
  const avatarLocalPath = req.file?.path

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing")
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath)

  if(!avatar.url){
    throw new ApiError(400, "Error while uploading on avatar")
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        avatar: avatar.url
      }
    },{new: true}
  ).select("-password")

  return res
  .status(200)
  .json(200, user, "avatar updated successfully")
}

// cover image updated
const updateUserCoverImage = async ( req, res) =>  {
  const coverImageLocalPath = req.file?.path

  if (!coverImageLocalPath) {
    throw new ApiError(400, "coverImage file is missing")
  }
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if(!coverImage.url){
    throw new ApiError(400, "Error while uploading on coverImage")
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        coverImage: coverImage.url
      }
    },{new: true}
  ).select("-password")

  return res
  .status(200)
  .json(200, user, "coverImage updated successfully")
}

export { registerUser, loginUser, logoutUser, refreshTokens, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateAvatarUser,updateUserCoverImage  };
