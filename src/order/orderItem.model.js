import mongoose from 'mongoose'

const orderSchema = mongoose.Schema(
	{
		sneakers: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Sneakers',
			require: true,
		},
		quantity: {
			type: Number,
			default: 1,
		},
		size: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Size',
			require: true,
		},
	},
	{ timestamps: true }
)

export default mongoose.model('OrderItem', orderSchema)
