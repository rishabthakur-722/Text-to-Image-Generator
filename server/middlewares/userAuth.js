import { clerkClient, getAuth } from "@clerk/express";
import userModel from "../models/userModel.js";

const getPrimaryEmail = (clerkUser) => {
  const primaryEmail = clerkUser.emailAddresses?.find(
    (email) => email.id === clerkUser.primaryEmailAddressId
  );

  return primaryEmail?.emailAddress || clerkUser.emailAddresses?.[0]?.emailAddress;
};

const findOrCreateUser = async (clerkUserId) => {
  let user = await userModel.findOne({ clerkId: clerkUserId });

  if (user) return user;

  const clerkUser = await clerkClient.users.getUser(clerkUserId);
  const email = getPrimaryEmail(clerkUser) || `${clerkUserId}@clerk.local`;
  const name =
    clerkUser.fullName ||
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
    clerkUser.username ||
    email;

  user = await userModel.findOne({ email });

  if (user) {
    user.clerkId = clerkUserId;
    user.name = name;
    user.photo = clerkUser.imageUrl || user.photo;
    return user.save();
  }

  return userModel.create({
    clerkId: clerkUserId,
    name,
    email,
    photo: clerkUser.imageUrl || "",
    creditBalance: 5
  });
};

const userAuth = async (req, res, next) => {
  try {
    const { userId: clerkUserId } = getAuth(req);

    if (!clerkUserId) {
      return res.status(401).json({ success: false, message: "Please sign in to continue" });
    }

    const user = await findOrCreateUser(clerkUserId);

    if (!req.body) req.body = {};
    req.body.userId = user._id.toString();
    req.userId = user._id.toString();
    req.clerkUserId = clerkUserId;

    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({ success: false, message: "Invalid or expired session" });
  }
};

export default userAuth;
