const express = require('express');
const cors = require('cors');
const { dbConecction } = require('../database/config');

class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';
        this.usuariosLogin = '/api/auth';

        //conectar a BD
        this.conectarDB();

        //Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
    }

    async conectarDB(){
        await dbConecction();
    }

    middlewares(){
        //cors
        this.app.use(cors());

        //lectura y parse del body (así todo lo que venga nuestro sistema lo intenta serializar a json)
        this.app.use(express.json());

        //acceso a la carpeta pública con archivos estáticos
        this.app.use(express.static('public'));
    }

    routes(){
        this.app.use(this.usuariosLogin, require('../routes/auth.js'));
        this.app.use(this.usuariosPath, require('../routes/usuarios'));
        //definir aquí el resto de rutas de la aplicación
    }

    listen(){
        //arrancamos servidor en el puerto indicado
        this.app.listen(this.port,()=> console.log(`Server is listening at port http://localhost:${this.port}`)
        )
    }

}

module.exports = Server;