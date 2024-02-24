import mongoose from 'mongoose'

const SneakersSchema = mongoose.Schema(
	{
		name: {
			type: String,
			require: true,
		},
		images: [{ type: String }],
		price: {
			type: Number,
			require: true,
		},
		sizes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Size',
				require: true,
			},
		],
		color: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Color',
			require: true,
		},
		views: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
)

export default mongoose.model('Sneakers', SneakersSchema)
