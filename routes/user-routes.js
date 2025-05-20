import express from 'express'
import { getAllUsers, createUser, getOneUser, login } from '../controllers/user-controller.js'

const router = express.Router()

router.get('/', getAllUsers)

router.post('/', createUser)

router.get('/:id', getOneUser)

// router.put('/:id', )

router.post('/login', login)

export default router;