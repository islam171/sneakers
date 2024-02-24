import cors from 'cors'
import dotenv from 'dotenv'
import express, { json } from 'express'
import fileUpload from 'express-fileupload'
import mongoose from 'mongoose'
import cartRoutes from './src/carts/cartsController.js'
import colorRoutes from './src/color/colorController.js'
import orderRoutes from './src/order/orderController.js'
import sizeRoutes from './src/size/sizeController.js'
import sneakersRoutes from './src/sneakers/sneakersController.js'
import userRoutes from './src/users/userController.js'
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3002

app.use(json())
app.use(cors())
app.use(fileUpload())
app.use(express.static('uploads'))
app.use('/uploads', express.static('uploads'))

const URI = process.env.MONGO_URI

mongoose
	.connect(URI)
	.then(() => console.log('DateBase success'))
	.catch(e => console.log('Error DateBase', e))

app.use('/sneakers', sneakersRoutes)
app.use('/size', sizeRoutes)
app.use('/colors', colorRoutes)
app.use('/user', userRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', orderRoutes)

app.listen(PORT, e => {
	if (e) {
		return console.log(err)
	}
	console.log(`Server PORT: ${PORT}`)
})
