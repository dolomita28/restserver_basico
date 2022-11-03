const mongoose = require('mongoose')

const dbConecction = async()=>{
 try{

    await mongoose.connect(process.env.MONGODB_CNN, {
        useNewUrlParser: true,
        useUnifiedTopology: true        
    });
    console.log('Base de datos online');
 }
 catch(err){
    console.log(err);
    throw new Error('Error al inicial la bbd');
 }
    
}

module.exports = {dbConecction}