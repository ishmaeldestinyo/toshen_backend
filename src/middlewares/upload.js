import multer from 'multer';
import { storage} from '../app.js';

const uploader = multer({storage});

export default uploader;