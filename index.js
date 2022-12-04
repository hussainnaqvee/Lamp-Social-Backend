import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet, { crossOriginResourcePolicy } from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controller/auth.js";
import { createPost } from "./controller/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/post.js";
import { users, posts } from "./data/index.js";

const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);
dotenv.config();

// config
const app = express();
app.use(express.json());
app.use(helmet());
app.use(crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assests", express.static(path.join(__dirname, "public/assests")));

//storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assests");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

//files routes
app.post("/auth/register/", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);
//routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
//db connection
const port = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port, () => console.log(`DB connected on port ${port}`));
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((err) => {
    console.error(err);
    console.error(`Unable to connect to the DB on port ${port}`);
  });
