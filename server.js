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

import ExpressMongoSanitize from 'express-mongo-sanitize'
app.use(
    ExpressMongoSanitize({
      allowDots: true,
      replaceWith: '_',
    }),
  );

//routers
import transactionRouter from './src/router/transactionRouter.js'
import authRouter from './src/router/authRouter.js'
import uploadRouter from './src/router/uploadRouter.js'


app.use('/api/v1/transaction', transactionRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/upload', uploadRouter)


app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})