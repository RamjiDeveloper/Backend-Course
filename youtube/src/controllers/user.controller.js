import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/claudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = async (req, res) => {
  console.log("✅ registerUser HIT");
  console.log("BODY:", req.body);
  console.log("FILES:", req.files);
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

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  console.log("🟢 avatar done");
  const coverImage = coverImageLocalPath
    ? await uploadOnCloudinary(coverImageLocalPath)
    : null;

  if (!avatar) {
    throw new ApiError(500, "Avatar upload failed");
  }
  console.log("🟢 coverImage done:", coverImage);

  const user = await User.create({
    fullname,
    email,
    password,
    username: username.toLowerCase(),
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });
  console.log("🟢 user created:", user._id);

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );
  console.log("🟢 createdUser:", createdUser);

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
};

export { registerUser };
