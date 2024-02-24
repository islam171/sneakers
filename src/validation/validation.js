import { body } from 'express-validator'

export const createSneakersValidation = [
	body('name', 'Имя задано не корректно').notEmpty().trim().isString(),
	body('price', 'Цена задано не корректно').notEmpty().isNumeric(),
	body('color').notEmpty().isMongoId(),
	body('sizes').notEmpty(),
]

export const createSizeValidation = [body('name').isNumeric()]
export const createColorValidation = [
	body('name').notEmpty().isString(),
	body('label').notEmpty().isString(),
]
export const createCartValidation = [
	body('sneakers').notEmpty().isMongoId(),
	body('size').notEmpty().isMongoId(),
]
export const createOrderValidation = [
	body('name').notEmpty().isString(),
	body('phone').notEmpty().isMobilePhone(),
	body('postCode').notEmpty().isNumeric(),
	body('country').notEmpty().isString(),
	body('city').notEmpty().isString(),
	body('street').notEmpty().isString(),
]

export const updateCountCart = [
	body('count').notEmpty().isNumeric(),
	body('size').notEmpty().isMongoId(),
]
export const removeCart = [body('size').notEmpty().isMongoId()]
export const registerValidation = [
	body('username').notEmpty().isString(),
	body('username').notEmpty().isString(),
]
export const loginValidation = [
	body('username').notEmpty().isString(),
	body('password').notEmpty().isString(),
]
