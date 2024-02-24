export const nameToSLug = name => {
	name = name.trim()
	name = name.toLowerCase()
	var from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;'
	var to = 'aaaaeeeeiiiioooouuuunc------'
	for (var i = 0, l = from.length; i < l; i++) {
		name = name.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
	}
	name = name
		.replace(/[^a-z0-9а-я -]/g, '') // remove invalid chars
		.replace(/\s+/g, '-') // collapse whitespace and replace by -
		.replace(/-+/g, '-') // collapse dashes
	return name
}

import jwt from 'jsonwebtoken'
import UserModel from '../users/userModel.js'

export const checkAuth = async (req, res, next) => {
	try {
		const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
		if (token) {
			try {
				const decoded = jwt.verify(token, 'm123')
				req.userId = decoded._id
				const user = await UserModel.findOne({ _id: req.userId }).exec()
				if (!user) {
					return res.status(403).json({
						message: 'Нет доступа',
					})
				}

				next()
			} catch (e) {
				res.status(403).json({
					message: 'Нет доступа',
				})
			}
		} else {
			res.status(403).json({
				message: 'Нет доступа',
			})
		}
	} catch (e) {}
}

export const checkAdmin = async (req, res, next) => {
	const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
	if (token) {
		try {
			const decoded = jwt.verify(token, 'm123')
			req.userId = decoded._id

			const user = await UserModel.findById(req.userId).exec()

			if (!user.isAdmin) {
				return res.status(403).json({
					message: 'Нет доступа',
				})
			}
			next()
		} catch (e) {
			console.log(e)
			res.status(403).json({
				message: 'Нет доступа',
			})
		}
	} else {
		res.status(403).json({
			message: 'Нет доступа',
		})
	}
}
