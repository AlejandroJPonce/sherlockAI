import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)


dotenv.config({path: join(__dirname, '.env')})


import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import auditRoutes from './routes/audit.routes.js'

const app = express()
const PORT = process.env.PORT || 3001

//middleware
app.use(cors({origin: 'http://localhost:5173'})) // con esto solo se aceptar req del front
app.use(express.json())

//rutas
app.use('/api/audit', auditRoutes)

// health check
app.get('/health', (req, res) => {
  res.json({status: 'ok', message: 'AuditAI server running'})
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})

//limiter

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
})

app.use(limiter)