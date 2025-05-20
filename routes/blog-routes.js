import express from 'express'
import {getPost, getPosts, createPost } from '../controllers/blog-controller.js'

const router = express.Router()



router.get('/', getPosts)

router.post('/', createPost)

router.get('/:id', getPost)

export default router;

