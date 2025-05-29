import axios from "axios";
import { getCart } from "./carrinhoService.js";
import { getUser } from "./loginService.js";

const API_URL = "http://localhost:5000/pedidos";

export async function criarPedido() {
  try {
    let cart = getCart();
    let logged = getUser();

    let date = new Date().toISOString().split('T')[0]; // "2025-05-13"
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
      total += cart[i].preco * cart[i].quantidade;
    }
    let pedido = {
      data: date,
      preco: total,
      status: "Pendente",
      id_cliente: logged.id,
    };

    let resp = await axios.post(API_URL, pedido);

    await adicionarProduto(resp.data.novoId);

    console.log("Resposta: ", resp);
  } catch (e) {
    console.log("Erro ao criar pedido: ", e);
  }
}

export async function alterarStatusPedido(id, pedido) {
  try {
    let url = `${API_URL}/${id}`;
    let resp = await axios.put(url, pedido); // Envia o objeto pedido completo
    console.log("Resposta: ", resp);
    return resp.data;
  } catch (e) {
    console.log("Erro ao alterar status do pedido: ", e);
  }
}

export async function adicionarProduto(novoId) {
  try {
    let cart = getCart();
    let url = `${API_URL}/produtos`;
    let produto, resp;
    for (let i = 0; i < cart.length; i++) {
      produto = {
        qtd: cart[i].quantidade,
        id: novoId,
        id_produto: cart[i].id,
      };
      resp = await axios.post(url, produto);
      console.log("Resposta: ", resp);
    }
  } catch (e) {
    console.log("Erro ao adicionar produto: ", e);
  }
}

export async function buscarPedidos() {
  try {
    let resp = await axios.get(API_URL);
    return resp.data;
  } catch (e) {
    console.log("Erro ao buscar pedidos: ", e);
  }
}

export async function buscarPedidosPorCliente(id) {
  try {
    let url = `${API_URL}/cliente/${id}`;
    let resp = await axios.get(url);
    return resp.data;
  } catch (e) {
    console.log("Erro ao buscar pedidos: ", e);
  }
}

export async function buscarProdutosPorPedido(id) {
  try {
    let url = `${API_URL}/produtos/${id}`;
    let resp = await axios.get(url);
    return resp.data;
  } catch (e) {
    console.log("Erro ao buscar produtos: ", e);
  }
}
