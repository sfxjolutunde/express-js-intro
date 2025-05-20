//Middleware
const logger = (req, res, next) => {
  console.log('From logger middleware, the request method is :', req.method)
  next()
}

export default logger