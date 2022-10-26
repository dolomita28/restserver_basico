const {response} = require('express');


const usuariosGet = (req, res = response) => {
    // sacar los query string de la request
    const params = req.query;

  res.json({msg:'get API - controlador',params})
}

const usuariosPost = (req, res = response) => {
    const body = req.body;

    res.json({msg:'post API - controlador', body})
  }

const usuariosPut = (req, res = response) => {
    // sacar parámetros de la request
    const id = req.params.id;
    res.json({msg:'put API - controlador',id})
  }


const usuariosDelete = (req, res = response) => {
    res.json({msg:'delete API - controlador'})
  }

const usuariosPatch = (req, res = response) => {
    res.json({msg:'patch API - controlador'})
  }


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
    usuariosPatch
}