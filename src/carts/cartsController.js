import express from 'express'
import { checkAuth } from '../utils/utils.js'
import {
	createCartValidation,
	removeCart,
	updateCountCart,
} from '../validation/validation.js'
import * as cartService from './cartsService.js'

const router = express.Router()

router.get('/', checkAuth, cartService.getByUser)
router.post('/', createCartValidation, checkAuth, cartService.create)
router.delete('/', checkAuth, cartService.clear)
router.patch('/delete/:id', checkAuth, removeCart, cartService.remove)
router.patch('/:id', checkAuth, updateCountCart, cartService.updateCount)

export default router
