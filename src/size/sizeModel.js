import mongoose from 'mongoose'

const sizeSchema = mongoose.Schema({
	name: {
		type: String,
		require: true,
		unique: true,
	},
})

export default mongoose.model('Size', sizeSchema)
