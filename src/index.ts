import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import taskRoutes from './routes/taskRoutes'
import connection from './routes/connection'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001

//Middleware
app.use(cors())
app.use(express.json())
app.use('/api/tasks', taskRoutes)
app.use('/api/auth', connection)

//MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/taskmanager', {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB')
}).catch((error) => console.log('MongoDB connection error:', error))

//Sample route 
app.get ('/', (req, res) => {
    res.send('API is running')
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})