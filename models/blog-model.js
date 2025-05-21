import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  review: { type: String },
});

const Blog = mongoose.model("Blog", BlogSchema);

export default Blog;
