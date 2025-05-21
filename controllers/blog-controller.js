import Blog from "../models/blog-model.js";

export const getPosts = async (req, res, next) => {
  const title = req.query.title;
  const limit = req.query.limit;
  if (title) {
    const blogs = await Blog.find({ title });
    if (blogs.length === 0) {
      const error = new Error(`Blog not found for this title: ${title}`);
      error.status = 404;
      return next(error);
    }
    res.status(200).json(blogs);
    return;
  }

  const blogs = await Blog.find().limit(limit);
  if (blogs.length === 0) {
    const error = new Error("Blogs not found");
    error.status = 404;
    return next(error);
  }

  res.status(200).json({ message: "Welcome To The Blog Page!", blogs });
};

export const createPost = async (req, res, next) => {
  const { title, content, review } = req.body;
  if (!title || !content) {
    const err = new Error("Title or Content or Author is missing!");
    err.status = 400;
    return next(err);
  }

  try {
    const newBlog = new Blog({
      title,
      content,
      author: req.user.id,
      review,
    });

    console.log("newBlog", newBlog);

    await newBlog.save();

    // Respond inside the try block to ensure newBlog is defined
    res.status(201).json({
      message: "Blog created successfully",
      newBlog,
    });
  } catch (error) {
    console.log("error", error.message);
    const err = new Error("Error while creating blog!");
    err.status = 400;
    return next(err);
  }
};

export const getPost = async (req, res, next) => {
  console.log("request params", req.params);

  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    const error = new Error("Blog does not exist");
    error.status = 404;
    return next(error);
  }
  res.status(200).json({
    msg: "Blog retrieved successfully",
    blog,
  });
};
