import {
    createProjectController,
    listProjectController,
    retrieveProjectController,
    deleteProjectController,
    updateProjectController,


    createCategoryController,
    listCategoryController,
    retrieveCategoryController,
    deleteCategoryController,
    updateCategoryController,

} from '../controllers/projectController.js';
import {Router} from 'express';
import authGuard from '../middlewares/authGuard.js';
export const projectRouter = Router();
import multer from 'multer';
import {v2 as cloudinary} from 'cloudinary';
import { config } from 'dotenv';
import {Project} from '../models/projectModel.js';

config();

cloudinary.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
})

// Use memory storage so file is available as buffer
const uploader = multer({ storage: multer.memoryStorage() });

projectRouter.post(
  "/",
  uploader.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Image is required" });
      }

      // Wrap Cloudinary upload into a Promise for easier async/await usage
      const uploadToCloudinary = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "projects" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });
      };

      const result = await uploadToCloudinary();

      // Save project data to MongoDB
      const { slug, description, category_id } = req.body;

      if (!slug || !description || !category_id) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const newProject = new Project({
        slug,
        description,
        images: result.secure_url,  // save Cloudinary image URL
        category: category_id,
      });

      await newProject.save();

      return res.status(201).json({
        message: "Project created successfully",
        project: newProject,
      });
    } catch (err) {
      console.error("Error uploading project:", err);
      res.status(500).json({ error: err.message || "Server error" });
    }
  }
);

  
projectRouter.get('/', listProjectController);
projectRouter.get('/categories', listCategoryController);
projectRouter.get('/categories/:id', retrieveCategoryController);
projectRouter.get('/:slug', retrieveProjectController);
projectRouter.delete('/:slug', authGuard, deleteProjectController);
projectRouter.put(
  "/:id",
  uploader.single("image"),
  async (req, res) => {

    if(!id) return res.status(400).json({ error: "Project ID is required" });
    
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Image is required" });
      }

      // Wrap Cloudinary upload into a Promise for easier async/await usage
      const uploadToCloudinary = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "projects", access_mode: "public",  },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });
      };

      const result = await uploadToCloudinary();

      // Save project data to MongoDB
      const { slug, description, category_id } = req.body;

      if (!slug || !description || !category_id) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const newProject = new Project({
        slug,
        description,
        images: result.secure_url,  // save Cloudinary image URL
        category: category_id,
      });

      await newProject.save();

      return res.status(201).json({
        message: "Project created successfully",
        project: newProject,
      });
    } catch (err) {
      console.error("Error uploading project:", err);
      res.status(500).json({ error: err.message || "Server error" });
    }
  }
);


// Category Routes
projectRouter.post('/categories', createCategoryController);
projectRouter.delete('/categories/:id', deleteCategoryController);
projectRouter.put('/categories/:id', authGuard, updateCategoryController);

export default projectRouter;