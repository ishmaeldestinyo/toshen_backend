import multer from 'multer';
import { storage} from '../../config/uploadConfig.js';

const uploader = multer({storage});

export default uploader;