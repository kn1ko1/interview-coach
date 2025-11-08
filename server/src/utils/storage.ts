import multer from 'multer';
import path from 'path';
import { Request } from 'express';

// Set up storage configuration for file uploads
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, 'uploads/'); // Specify the directory to store uploaded files
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Create a unique filename
  }
});

// Create the multer instance for handling file uploads
const upload = multer({ storage: storage });

// Export the upload middleware for use in routes
export default upload;