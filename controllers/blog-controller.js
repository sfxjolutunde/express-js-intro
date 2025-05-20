
import BlogModel from '../models/blog-model.js';

export const getPosts = async (req, res, next) => {
  const title = req.query.title;
  const limit = req.query.limit;
if(title) {
  const blogs =  await BlogModel.find({title})
  if(blogs.length === 0) {
    const error = new Error(`Blog not found for this title: ${title}`)
    error.status = 404;
    return next(error)
  }
  res.status(200).json(blogs)
  return;
}

const blogs = await BlogModel.find().limit(limit)
  if(blogs.length === 0) {
    const error = new Error('Blogs not found')
    error.status = 404;
    return next(error)
  }

  res.status(200).json({message: 'Welcome To The Blog Page!', blogs})
}

export const createPost = async (req, res, next) => {
  const { title, content, author, review } = req.body;
  if(!title || !content || !author) {
    const err =  new Error('Title or Content or Author is missing!')
    err.status = 400;
    return next(err);
  }
  
  try {
    const newBlog = new BlogModel({
      title,
      content,
      author,
      review
    })

    await newBlog.save()
  } catch (error) {
    console.log('error', error.message)
    const err =  new Error('Error while creating blog!')
    err.status = 400;
    return next(err);
  }
  res.status(201).json({
    message: 'Blog created successfully',
    newBlog
  })
}

export const getPost = async (req, res, next) => {
  console.log('request params', req.params)

  const blog = await BlogModel.findById(req.params.id)

  if(!blog) {
    const error = new Error('Blog does not exist')
    error.status = 404;
    return next(error)
  }
  res.status(200).json({
    msg: 'Blog retrieved successfully',
    blog
  })
  
}