import { validateSimilarity } from "../services/claude.service.js"
import { transcribeAudio } from "../services/whisper.service.js"


const VALID_AUDIO_TYPES = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/x-m4a', 'audio/mp3']

export const validateAudio = async (req, res) => {
  try {

    //1. Verificamos que llegue el archivo
    if (!req.file) {
      return res.status(400).json({error: 'No se recibió archivo de audio'})
    }

    //0. Validamos el tipo de archivo una vez llega al back
    if (!VALID_AUDIO_TYPES.includes(req.file.mimetype)) {
      return res.status(400).json({error: 'Formato de audio no válido'})
    }

    //2. obtener los datos del registro del body
    const recordData = JSON.parse(req.body.recordData)

    //3. transcribir el audio con Whisper
    const transcription = await transcribeAudio(req.file.buffer, req.file.originalname)

    //4. comparar con Claude
    const result = await validateSimilarity(transcription, recordData)

    //5. devolver el resultado del frontend
    res.json({
      transcription,
      score: result.score,
      status: result.status,
      reasoning: result.reasoning
    })
  } catch (error) {
    res.status(500).json({error: error.message})
  }
}