import express from 'express'
import { checkAdmin } from '../utils/utils.js'
import { createSneakersValidation } from '../validation/validation.js'
import * as SneakersService from './sneakersService.js'

const router = express.Router()

router.post('/', createSneakersValidation, SneakersService.create)
router.get('/', SneakersService.getAll)
router.delete('/:id', checkAdmin, SneakersService.remove)
router.patch('/:id', checkAdmin, SneakersService.update)

export default router
