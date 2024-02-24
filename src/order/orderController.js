import express from 'express'
import { checkAuth } from '../utils/utils.js'
import { createOrderValidation } from '../validation/validation.js'
import * as orderService from './orderService.js'

const router = express.Router()

router.get('/', checkAuth, orderService.getByUser)
router.post('/', checkAuth, createOrderValidation, orderService.create)

export default router
