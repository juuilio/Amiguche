import * as usuarioRepository from '../Repositories/usuarioRepository.js';
import { Router } from 'express';
const endpoints = Router();

//perguntar ao bruno quais endpoints são necessários

endpoints.get('/usuario', async (req, resp) => {
  let registros = await usuarioRepository.listarUsuario();
  resp.send(registros);
})

endpoints.post('/usuario/login',async (req, resp) => {
  let usuario= req.body;
  let usuarioEncontrado = await usuarioRepository.buscarUsuario(usuario);
  if(usuarioEncontrado){
    resp.status(200).send({id:usuarioEncontrado.id_usuarios});
  }else{
    resp.status(404).send({message: "Usuário não encontrado"});
  }  
})

endpoints.post('/usuario', async (req, resp) => {
  let usuario = req.body;

  let novoId = await usuarioRepository.criarUsuario(usuario);
  resp.send({ novoId })
})

export default endpoints;