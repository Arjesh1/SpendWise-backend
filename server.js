import express from 'express'
const app = express()
import * as dotenv from 'dotenv'
dotenv.config()

import morgan from 'morgan'


if(process.env.NODE_ENV === 'development'){
app.use(morgan('dev'))
}

// database connection
import { dbConnect } from './src/config/dbConfig.js'
dbConnect() 



const PORT = process.env.PORT || 5100 

//routers

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})