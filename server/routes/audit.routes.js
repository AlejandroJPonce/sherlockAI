import { Router } from "express";
import { validateAudio } from '../controllers/audit.controllers.js'
import { upload } from "../middleware/upload.middleware.js";

const router = Router()

//ruta de prueba
router.get('/test', (req, res) => {
  res.json({message: 'audit routes working!'})
})

router.post('/validate', upload.single('audio'), validateAudio)

export default router