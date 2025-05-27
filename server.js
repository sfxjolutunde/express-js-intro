import express from 'express';
import blogRoutes from './routes/blog-routes.js'
import userRoutes from './routes/user-routes.js'
import logger from './middlewares/logger.js';
import errorHandler from './middlewares/error-handler.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import multer from 'multer';
import {v2 as cloudinary} from 'cloudinary';
import cookieParser from 'cookie-parser';
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

cloudinary.config({ 
	cloud_name: process.env.CLOUD_NAME, 
	api_key: process.env.CLOUD_KEY, 
	api_secret: process.env.CLOUD_SEC
});

const upload = multer();

app.use(express.json());
app.use(cookieParser());

app.use(logger);

app.use('/blogs', blogRoutes);
app.use('/users', userRoutes);

app.post('/upload', upload.single('file'), async (req, res) => {

	console.log('req.file', req.file)
	if(!req.file) {
		const err = new Error('File is missing!')
		err.status = 400;
		return res.status(400).json({message: 'File is missing!'})
	}

	if(req.file.mimetype !== 'image/png' && req.file.mimetype !== 'image/jpeg') {
		const err = new Error('File type is not supported!')
		err.status = 400;
		return res.status(400).json({message: 'File type is not supported!'})
	}


	const b64 = Buffer.from(req.file.buffer).toString('base64')
	let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

	console.log('dataURI', dataURI)

		const uploadedImage = await cloudinary.uploader.upload(dataURI)
		res.status(200).json({message: 'File uploaded successfully!', data: uploadedImage})
	}
	)


	app.use((req, res, next) => {
		const error = new Error('Route Not Found!')
		error.status = 404;
		next(error)
	})

	app.use(errorHandler)

	mongoose
		.connect(process.env.M0NGODB_URI)
		.then(() => {
			console.log("Connected to MongoDB");
		})
		.catch((err) => {
			console.log("Error connecting to MongoDB", err);
		});





app.listen(port, () => console.log(`server started on port ${port}`))

