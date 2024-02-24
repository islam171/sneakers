import { validationResult } from 'express-validator'
import { errorBound } from '../utils/error.js'
import orderModel from './orderModel.js'

export const getByUser = async (req, res) => {
	try {
	} catch (error) {
		errorBound(res, error)
	}
}

export const create = async (req, res) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array())
		}

		const { phone, postCode, name, country, city, street } = req.body
		const { userId } = req
		const orderItems = req.body.orderItems

		const orderDoc = {
			name,
			phone,
			postCode,
			country,
			city,
			street,
			user: userId,
			data: orderItems,
		}

		const doc = orderModel(orderDoc)
		const order = await doc.save()
		return res.json(order)
	} catch (error) {
		errorBound(res, error)
	}
}
