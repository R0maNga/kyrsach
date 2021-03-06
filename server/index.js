require('dotenv').config();
const express = require('express');
const sequelize =require('./db')
const models= require('./models/models')
const cors = require('cors')
const router= require('./routes/index')
const fileUploads = require('express-fileupload')
const errorHandler= require('./middleware/ErrorHandlingMidleware')
const path = require('path')
const morgan = require('morgan')


const PORT=process.env.PORT || 5000;
const app=express();
app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUploads({}))
app.use('/api', router)
app.use(morgan('short'))


//обработка ошибок, послдений middleweare
app.use(errorHandler)


const start = async ()=>{
    try{
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT,() =>console.log(`Server started on port ${PORT}`));
} catch (e){
    console.log(e)
}
}
start()
