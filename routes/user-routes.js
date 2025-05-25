import express from 'express'
import { getAllUsers, signUp, getOneUser, login } from '../controllers/user-controller.js'
import { protect } from '../middlewares/auth.js';
import { authorizeRoles } from '../middlewares/role-based-guard.js';

const router = express.Router()

router.get('/',protect,authorizeRoles('admin'), getAllUsers)

router.post('/signUp', signUp)

router.get('/:id',protect,authorizeRoles('admin'), getOneUser)

// router.put('/:id', )

router.post('/login', login)

export default router;