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
import {CloudinaryStorage} from 'multer-storage-cloudinary';

cloudinary.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
})

export const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads',
        allowed_formats: ['jpg', 'png', 'jpeg'],
    }
})

const uploader = multer({storage});

projectRouter.post('/projects', uploader.single("image"), async (req, res, next) => {
    try {
      const slug = req.body.slug;
      const description = req.body.description;
      const category = req.body.category_id;
      const file = req.file;
  
      console.log("slug:", slug);
      console.log("description:", description);
      console.log("category_id:", category);
      console.log("file:", file);
  
      // Do DB logic / cloudinary upload / save here
      return res.status(200).json({ message: "Project created successfully!" });
    } catch (err) {
      console.error("Error creating project:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
  
projectRouter.get('/projects', listProjectController);
projectRouter.get('/projects/:slug', retrieveProjectController);
projectRouter.delete('/projects/:slug', authGuard, deleteProjectController);
projectRouter.put('/projects/:slug', authGuard, updateProjectController);

// Category Routes
projectRouter.post('/categories', createCategoryController);
projectRouter.get('/categories', listCategoryController);
projectRouter.get('/categories/:id', retrieveCategoryController);
projectRouter.delete('/categories/:id', deleteCategoryController);
projectRouter.put('/categories/:id', authGuard, updateCategoryController);

export default projectRouter;