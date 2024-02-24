import express from 'express'
import { createSizeValidation } from '../validation/validation.js'
import * as sizeService from './sizeService.js'

const router = express.Router()

router.get('/', sizeService.getAll)

router.post('/', createSizeValidation, sizeService.create)

export default router
