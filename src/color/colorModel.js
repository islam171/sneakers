import mongoose from 'mongoose'

const colorSchema = mongoose.Schema({
	name: {
		type: String,
		require: true,
		unique: true,
	},
})

export default mongoose.model('Color', colorSchema)
