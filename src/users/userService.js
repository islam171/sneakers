import { validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import UserModel from './userModel.js'

export const updateUser = async (req, res) => {
	try {
		const userId = req.userId
		await UserModel.findOneAndUpdate(
			{ _id: userId },
			{
				username: req.body.username,
				avatarURL: req.body.photo,
			}
		)

		const user = await UserModel.findOne({ _id: userId }).exec()
		res.json(user)
	} catch (e) {
		res.status(404).json({
			message: 'Не удалось изменить пользователя',
		})
		console.log(e)
	}
}

export const login = async (req, res) => {
	try {
		const user = await UserModel.findOne({ username: req.body.username })

		if (!user) {
			return res.status(404).json({
				message: 'Пользователь не найден',
			})
		}

		if (user.password != req.body.password) {
			return res.status(404).json({
				message: 'Неверный пароль',
			})
		}

		const token = jwt.sign(
			{
				_id: user._id,
			},
			'm123',
			{
				expiresIn: '3d',
			}
		)

		const { password, ...userData } = user._doc

		res.json({
			...userData,
			token,
		})
	} catch (e) {
		res.status(500).json({ message: 'Не удалось авторизоваться' })
	}
}

export const register = async (req, res) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array())
		}

		const doc = UserModel({
			username: req.body.username,
			password: req.body.password,
			isAdmin: false,
		})
		const oldUser = await UserModel.findOne({ username: req.body.username })
		if (oldUser) {
			return res
				.status(404)
				.json({ message: 'Такой пользователь уже существует' })
		}
		const user = await doc.save()

		const token = jwt.sign(
			{
				_id: user._id,
			},
			'm123',
			{
				expiresIn: '3d',
			}
		)

		const { password, ...userData } = user._doc

		res.json({ userData, token })
	} catch (e) {
		console.log(e)
		res.status(500).json({ message: 'Не удолось зарегистрироватся' })
	}
}

export const getMe = async (req, res) => {
	const user = await UserModel.findById(req.userId)
	if (!user) {
		return res.status(404).json({
			message: 'Пользователь не найден',
		})
	}
	const { password, ...userdata } = user._doc
	res.json(userdata)
}

export const getAll = async (req, res) => {
	try {
		const search = req.query.search

		let filter = { isAdmin: false }

		if (search) {
			filter.username = { $regex: search, $options: 'i' }
		}

		const movie = await UserModel.find(
			filter,
			'_id username isAdmin updatedAt createdAt'
		)

		return res.json(movie)
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'error' })
	}
}

export const remove = async (req, res) => {
	try {
		const { id } = req.params
		const doc = await UserModel.findByIdAndDelete(id)
		if (!doc) {
			return res
				.status(500)
				.json({ message: 'Не удалось удалить пользователя' })
		}
		return res.json({ message: 'success' })
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'error' })
	}
}
