import mongoose from 'mongoose'

const CartSchema = mongoose.Schema(
	{
		sneakers: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Sneakers',
			require: true,
		},
		count: {
			type: Number,
			default: 1,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			require: true,
			ref: 'User',
		},
		size: {
			type: mongoose.Schema.Types.ObjectId,
			require: true,
			ref: 'Size',
		},
	},
	{
		timestamps: true,
	}
)

export default mongoose.model('Cart', CartSchema)
