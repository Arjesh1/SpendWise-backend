import express from 'express'
const app = express()
import * as dotenv from 'dotenv'
dotenv.config()

import morgan from 'morgan'
import cors from 'cors'

app.use(cors());


if(process.env.NODE_ENV === 'development'){
app.use(morgan('dev'))
}

// database connection
import { dbConnect } from './src/config/dbConfig.js'
dbConnect() 

const PORT = process.env.PORT || 5100 

app.use(express.json())

//routers
import transactionRouter from './src/router/transactionRouter.js'
import authRouter from './src/router/authRouter.js'

app.use('/api/v1/transaction', transactionRouter)
app.use('/api/v1/auth', authRouter)


app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})