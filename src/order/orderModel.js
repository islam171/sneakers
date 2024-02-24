import mongoose from 'mongoose'

const orderSchema = mongoose.Schema(
	{
		name: {
			type: String,
			require: true,
		},
		phone: {
			type: String,
			require: true,
		},
		country: {
			type: String,
			require: true,
		},
		city: {
			type: String,
			require: true,
		},
		postCode: {
			type: Number,
			require: true,
		},
		street: {
			type: String,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			require: true,
		},
		status: {
			type: String,
			require: true,
		},
		data: {
			type: String,
			require: true,
		},
	},
	{ timestamps: true }
)

export default mongoose.model('Order', orderSchema)
