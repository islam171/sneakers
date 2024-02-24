export const errorBound = (res, e) => {
	console.log(e)
	res.status(500).json({ message: 'error' })
}
