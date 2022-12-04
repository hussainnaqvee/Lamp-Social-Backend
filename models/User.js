import mongoose, { Mongoose } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },

    lastName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },

    email: {
      type: String,
      required: true,
      max: 50,
      uniqued: true,
    },
    password: {
      type: String,
      required: true,
      min: 8,
      max: 50,
    },
    picturePath: {
      type: String,
      default: "",
    },
    friends: {
      type: Array,
      default: "",
    },
    location: String,
    occupation: String,
    impressions: Number,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
