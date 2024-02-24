import { validationResult } from 'express-validator'
import fs from 'fs'
import path from 'path'
import colorModel from '../color/colorModel.js'
import sizeModel from '../size/sizeModel.js'
import { errorBound } from '../utils/error.js'
import sneakersModel from './sneakersModel.js'

export const create = async (req, res) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array())
		}

		let { name, price, color, sizes } = req.body
		const images = req.files?.images

		let sneakers = {}
		sneakers.name = name
		sneakers.price = price

		if (images) {
			let filename = Date.now().toString() + images.name
			let posterFile = path.join('uploads/sneakers/', filename)
			if (fs.existsSync(images)) {
				return res.status(400).json({ message: 'File already exist' })
			}
			images.mv(posterFile)
			sneakers.images = posterFile
		} else {
			return res.status(400).json({ message: 'Нету изображении' })
		}

		if (color) {
			let oldColor = await colorModel.findById(color)
			if (!oldColor) {
				return res.status(400).json({ message: 'Цвет не найден' })
			}
			sneakers.color = color
		}

		if (sizes) {
			sizes = sizes.replaceAll(' ', '').split(',')
			for (let item of sizes) {
				let size = await sizeModel.findById(item.trim())
				if (!size) {
					return res.status(400).json({ message: 'Неверный размер' })
				}
			}
			sneakers.sizes = sizes
		}

		const doc = await sneakersModel(sneakers)
		doc.save()

		res.json(doc)
	} catch (e) {
		errorBound(res, e)
	}
}

const setSort = (sort, orderValues) => {
	switch (sort) {
		case 'popular':
			return { views: orderValues * -1 || 1 }
		case 'price':
			return { price: orderValues || 1 }
	}
	return { name: orderValues || 1 }
}

const setOrder = order => {
	if (order == 'DESC') {
		return -1
	}
	return 1
}

export const getAll = async (req, res) => {
	try {
		const { search, color, sort, order } = req.query
		const limit = req.query?.limit || 10
		const page = req.query?.page || 1

		let filter = {}

		!!search && (filter.name = { $regex: search, $options: 'i' })
		!!color && (filter.color = color)

		const skip = page * limit - limit

		let orderValues = setOrder(order)
		let sortValues = setSort(sort, orderValues)

		const sneakers = await sneakersModel
			.find(filter, null, { skip, limit })
			.sort(sortValues)
			.populate('sizes')

		res.json(sneakers)
	} catch (e) {
		errorBound(res, e)
	}
}

export const remove = async (req, res) => {
	try {
		const { id } = req.params

		const sneakers = await sneakersModel.findByIdAndDelete(id)

		if (!sneakers) {
			return res.status(403).json({ message: 'Не удалось удалить товар' })
		}

		for (let image of sneakers.images) {
			fs.unlinkSync(image)
		}

		return res.json({ message: 'success' })
	} catch (error) {
		errorBound(res, error)
	}
}

export const update = async (req, res) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array())
		}
		// return res.json({ message: 'success' })
		let { id } = req.params
		let { name, price, color, sizes } = req.body
		const images = req.files?.images

		let sneakers = {}
		sneakers.name = name
		sneakers.price = price

		if (images) {
			if (images.length > 1) {
				let files = []
				for (const image of images) {
					let filename = Date.now().toString() + image.name
					let posterFile = path.join('uploads/sneakers/', filename)
					if (fs.existsSync(image)) {
						return res.status(404).json({ message: 'File already exist' })
					}
					image.mv(posterFile)
					files.push(posterFile)
				}
				sneakers.images = files
			} else {
				let filename = Date.now().toString() + images.name
				let posterFile = path.join('uploads/sneakers/', filename)
				if (fs.existsSync(images)) {
					return res.status(404).json({ message: 'File already exist' })
				}
				images.mv(posterFile)
				sneakers.images = posterFile
			}
		}

		if (color) {
			let oldColor = await colorModel.findById(color)
			if (!oldColor) {
				return res.status(400).json({ message: 'Цвет не найден' })
			}
			sneakers.colors = color
		}

		if (sizes) {
			sizes = sizes.replaceAll(' ', '').split(',')
			for (let item of sizes) {
				let size = await sizeModel.findById(item.trim())
				if (!size) {
					return res.status(400).json({ message: 'Неверный размер' })
				}
			}
			sneakers.sizes = sizes
		}

		await sneakersModel.findByIdAndUpdate(id, sneakers)

		const newSneakers = await sneakersModel.findById(id)
		res.json(newSneakers)
	} catch (e) {
		errorBound(res, e)
	}
}
