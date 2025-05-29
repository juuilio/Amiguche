import * as clienteRepository from "../Repositories/clienteRepository.js";
import { Router } from "express";
const endpoints = Router();

endpoints.get('/cliente', async (req, resp) => {
  let registros = await clienteRepository.listarClientes();
  resp.send(registros);
})

endpoints.post('/cliente/login',async (req,resp)=>{
  let cliente= req.body;
  let clienteEncontrado = await clienteRepository.buscarCliente(cliente);
  if(clienteEncontrado){
    resp.status(200).send({id:clienteEncontrado.id_clientes});
  }else{
    resp.status(404).send({message: "Cliente não encontrado"});
  }  
})

endpoints.post('/cliente', async (req, resp) => {
  let cliente = req.body;

  let novoId = await clienteRepository.criarCliente(cliente);
  resp.send({ novoId })
})

endpoints.put('/cliente/:id', async (req, resp) => {
  let id = req.params.id;
  let cliente = req.body;

  await clienteRepository.atualizarCliente(id, cliente);
  resp.send({ message: "Cliente atualizado com sucesso" });
})

endpoints.delete('/cliente/:id', async (req, resp) => {
  let id = req.params.id;

  await clienteRepository.removerCliente(id);
  resp.send({ message: "Cliente removido com sucesso" });
})

endpoints.get('/cliente/:id', async (req, resp) => {
  let id = req.params.id;

  let cliente = await clienteRepository.buscarClientePorId(id);
  if (!cliente) {
    return resp.status(404).send({ message: "Cliente não encontrado" });
  }
  resp.send(cliente);
})

export default endpoints;