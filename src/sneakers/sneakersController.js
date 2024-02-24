import express from 'express'
import { createSneakersValidation } from '../validation/validation.js'
import * as SneakersService from './sneakersService.js'

const router = express.Router()

router.post('/', createSneakersValidation, SneakersService.create)
router.get('/', SneakersService.getAll)
router.delete('/:id', SneakersService.remove)
router.patch('/:id', SneakersService.update)

export default router
