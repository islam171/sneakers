import express from 'express'
import { checkAdmin, checkAuth } from '../utils/utils.js'
import {
	loginValidation,
	registerValidation,
} from '../validation/validation.js'
import * as UserService from './userService.js'

const router = express.Router()

router.post('/register', registerValidation, UserService.register)
router.post('/login', loginValidation, UserService.login)
router.get('/', checkAuth, checkAdmin, UserService.getAll)
router.get('/:id', checkAuth, checkAdmin, UserService.remove)

export default router
