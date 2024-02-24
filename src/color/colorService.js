import { errorBound } from '../utils/error.js'
import colorsModel from './colorModel.js'

export const getAll = async (req, res) => {
	try {
		const colors = await colorsModel.find()

		return res.json(colors)
	} catch (error) {
		errorBound(res, error)
	}
}

export const create = async (req, res) => {
	try {
		const { name } = req.body

		const doc = await colorsModel({
			name,
		})
		await doc.save()

		if (!doc) {
			return res.status(400).json({ message: 'Не удалось создать цвет' })
		}

		return res.json(doc)
	} catch (error) {
		errorBound(res, error)
	}
}
