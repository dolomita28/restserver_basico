const express = require('express');
const cors = require('cors');

class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

        //Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
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