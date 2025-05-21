import express from 'express'
import {getPost, getPosts, createPost } from '../controllers/blog-controller.js'
import { authenticate } from '../middlewares/auth.js';

const router = express.Router()



router.get('/', getPosts)

router.post('/',authenticate, createPost)

router.get('/:id', getPost)

export default router;

