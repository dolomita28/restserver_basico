const express = require('express');
const cors = require('cors');
const { dbConecction } = require('../database/config');

class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        // rutas
        this.paths = {
            auth: '/api/auth',
            categorias: '/api/categorias',
            productos: '/api/productos',
            search: '/api/search',
            usuarios: '/api/usuarios'                        
        }
        

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
        this.app.use(this.paths.auth, require('../routes/auth.js'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));       
        this.app.use(this.paths.productos, require('../routes/productos'));        
        this.app.use(this.paths.search, require('../routes/search'));
        
        //definir aquí el resto de rutas de la aplicación
    }

    listen(){
        //arrancamos servidor en el puerto indicado
        this.app.listen(this.port,()=> console.log(`Server is listening at port http://localhost:${this.port}`)
        )
    }

}

module.exports = Server;