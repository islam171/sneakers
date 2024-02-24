import { validationResult } from 'express-validator'
import sneakersModel from '../sneakers/sneakersModel.js'
import { errorBound } from '../utils/error.js'
import cartsModel from './cartsModel.js'

export const getByUser = async (req, res) => {
	try {
		const { userId } = req
		const carts = await cartsModel
			.find({ user: userId })
			.populate('sneakers')
			.populate('size')
			.exec()

		let totalCount =
			carts.length > 0
				? carts.reduce(function (acc, obj) {
						return acc + obj.count
				  }, 0)
				: 0
		let totalPrice =
			carts.length > 0
				? carts.reduce(function (acc, obj) {
						return acc + obj.sneakers.price * obj.count
				  }, 0)
				: 0

		res.json({ carts, totalCount, totalPrice })
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

		const { userId } = req
		const { sneakers, size } = req.body
		const sneakersDoc = await sneakersModel.findById(sneakers)

		if (!!!sneakersDoc) {
			return res.status(400).json({ message: 'Такие кроссовки не существует' })
		}

		const sizeDoc = await sneakersModel.findOne({ _id: sneakers, sizes: size })
		if (!!!sizeDoc) {
			return res
				.status(400)
				.json({ message: 'Такой размер у данной модели отсутствует' })
		}

		const cart = await cartsModel.findOne({
			sneakers,
			user: userId,
			size: size,
		})
		if (cart) {
			cart.count = cart.count + 1
			await cart.save()
		} else {
			const doc = cartsModel({ sneakers, count: 1, user: userId, size })
			await doc.save()
		}

		await sneakersModel.findByIdAndUpdate(sneakers, { $inc: { views: 1 } })

		return await getByUser(req, res)
	} catch (error) {
		errorBound(res, error)
	}
}

export const remove = async (req, res) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array())
		}

		const { userId } = req
		const { id } = req.params
		const { size } = req.body

		const cart = await cartsModel.findOneAndDelete({
			user: userId,
			sneakers: id,
			size,
		})

		if (!!!cart) {
			return res
				.status(400)
				.json({ message: 'Не удалось удалить товар из корзины' })
		}

		return await getByUser(req, res)
	} catch (error) {
		errorBound(res, error)
	}
}

export const updateCount = async (req, res) => {
	try {
		const { userId } = req
		const { id } = req.params
		const { size } = req.body

		const oldCart = await cartsModel.findOne({
			size,
			user: userId,
			sneakers: id,
		})

		if (!!!oldCart) {
			return res.status(400).json({ message: 'Такой товар не найден' })
		}

		if (oldCart.count > 1) {
			await cartsModel.findOneAndUpdate(
				{
					user: userId,
					sneakers: id,
					size,
				},
				{ count: oldCart.count - 1 }
			)
		} else {
			await cartsModel.findOneAndDelete({
				user: userId,
				sneakers: id,
				size,
			})
		}

		return await getByUser(req, res)
	} catch (error) {
		errorBound(res, error)
	}
}

export const clear = async (req, res) => {
	try {
		const { userId } = req
		await cartsModel.deleteMany({ user: userId })
		res.json({ message: 'success' })
	} catch (error) {
		errorBound(res, error)
	}
}
