import * as pedidosRepository from '../Repositories/pedidosRepository.js';
import { Router } from 'express';
const endpoints = Router();

endpoints.get('/pedidos', async (req, resp) => {
  try {
    const pedidos = await pedidosRepository.listarPedidos();
    resp.send(pedidos);
  } catch (error) {
    console.error(error);
    resp.status(500).json({ error: 'Erro ao listar pedidos' });
  }
})

endpoints.get('/pedidos/cliente/:id', async (req, resp) => {
  const cliente = req.params.id;
  try {
    const pedidos = await pedidosRepository.listarPedidosPorCliente(cliente);
    resp.send(pedidos);
  } catch (error) {
    console.error(error);
    resp.status(500).json({ error: 'Erro ao listar pedidos por cliente' });
  }
});

endpoints.post('/pedidos', async (req, resp) => {
  const pedido = req.body;
  try {
    const novoId = await pedidosRepository.criarPedido(pedido);
    resp.status(201).json({ novoId });
  } catch (error) {
    console.error(error);
    resp.status(500).json({ error: 'Erro ao criar pedido' });
  }
})

endpoints.post('/pedidos/produtos', async (req, resp) => {
  const produto = req.body;
  try {
    const novoId = await pedidosRepository.adicionarProduto(produto);
    resp.status(201).json({ novoId });
  } catch (error) {
    console.error(error);
    resp.status(500).json({ error: 'Erro ao adicionar produto ao pedido' });
  }
})

endpoints.get('/pedidos/produtos/:id', async (req, resp) => {
  const id = req.params.id;
  try {
    const produtos = await pedidosRepository.buscarProdutos(id);
    resp.send(produtos);
  } catch (error) {
    console.error(error);
    resp.status(500).json({ error: 'Erro ao listar produtos do pedido' });
  }
});

endpoints.put('/pedidos/:id',async (req, resp) => {
  const id = req.params.id;
  const pedido = req.body;
  try {
    await pedidosRepository.alterarPedido(pedido, id);
    resp.status(200).json({ message: 'Pedido atualizado com sucesso' });
  } catch (error) {
    console.error(error);
    resp.status(500).json({ error: 'Erro ao atualizar pedido' });
  }
});

endpoints.delete('/pedidos/:id', async (req, resp) => {
  const id_pedido = req.params.id;
  try {
    await pedidosRepository.deletarPedido(id_pedido);
    resp.status(204).send();
  } catch (error) {
    console.error(error);
    resp.status(500).json({ error: 'Erro ao deletar pedido' });
  }
})

endpoints.delete('/pedidos/:id_pedido/produto/:id_produto', async (req, resp) => {
  const { id_pedido, id_produto } = req.params;
  try {
    await pedidosRepository.deletarProdutoPedido(id_pedido, id_produto);
    resp.status(204).send();
  } catch (error) {
    console.error(error);
    resp.status(500).json({ error: 'Erro ao deletar produto do pedido' });
  }
})


export default endpoints;
//listagem de pedidos para a véia???
