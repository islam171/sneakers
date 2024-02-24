import { validationResult } from 'express-validator'
import { errorBound } from '../utils/error.js'
import sizeModel from './sizeModel.js'

export const create = async (req, res) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array())
		}
		const { name } = req.body

		const doc = sizeModel({ name })
		await doc.save()

		if (!doc) {
			return res.status(400).json({ message: 'Не удалось создать цвет' })
		}

		return res.json(doc)
	} catch (error) {
		errorBound(res, error)
	}
}

export const getAll = async (req, res) => {
	try {
		const size = await sizeModel.find()

		return res.json(size)
	} catch (error) {
		errorBound(res, error)
	}
}
