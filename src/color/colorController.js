import { Router } from 'express'
import { createColorValidation } from '../validation/validation.js'
import * as colorServices from './colorService.js'

const router = Router()

router.get('/', colorServices.getAll)
router.post('/', createColorValidation, colorServices.create)

export default router
