import express from 'express'
import {getPost, getPosts, createPost, updatePost } from '../controllers/blog-controller.js'
import { protect } from '../middlewares/auth.js';

const router = express.Router()

//CRUD operations for blog posts

// create, read, update, delete

//create = POST
//read = GET  
//update = PUT or PATCH
//delete = DELETE

router.get('/', getPosts)

router.post('/',protect, createPost)

router.get('/:id', getPost)

router.put('/:id', protect, updatePost)

export default router;

