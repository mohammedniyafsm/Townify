import express, { Router } from 'express';
import { uploadMap, updateMap, deleteMap, fetchMaps, getMap } from './controller.js';
import { mapUpload } from 'src/lib/multer.js';

const router: Router = express.Router();

const mapMulter= mapUpload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'mapJson', maxCount: 1 }
])

router.post('/',mapMulter, uploadMap);

router.get('/', fetchMaps);

router.get('/:id', getMap);

router.patch('/:id', mapMulter, updateMap);

router.delete('/:id', deleteMap);

export default router;