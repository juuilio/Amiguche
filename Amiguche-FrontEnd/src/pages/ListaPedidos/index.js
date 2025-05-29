import React, { useState, useEffect } from "react";
import { buscarPedidos, buscarProdutosPorPedido, alterarStatusPedido } from "../../services/pedidosService.js";
import HeaderAdm from "../../components/headerAdm";
import "./index.scss";

export default function ListaPedidos() {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    carregarPedidos();
  }, [carregarPedidos]);

  async function carregarPedidos() {
    try {
      let lista = await buscarPedidos();
      for (let i = 0; i < lista.length; i++) {
        let produtos = await buscarProdutosPorPedido(lista[i].id);
        lista[i] = {
          ...lista[i],
          produtos,
        };
      }
      setPedidos(lista);
    } catch (err) {
      console.error("Erro ao carregar pedidos:", err);
    }
  }

  async function alterarStatus(id, pedido) {
  try {
    const novoStatus = pedido.status === "Entregue" ? "Pendente" : "Entregue";
    const pedidoAtualizado = {
      ...pedido,
      status: novoStatus,
      preco: parseFloat(pedido.preco)
    };
    
    let resp = await alterarStatusPedido(id, pedidoAtualizado);
    console.log("Resposta: ", resp); 
  } catch (e) {
    console.log("Erro ao alterar status do pedido: ", e);
  }
}

  return (
    <main className="lista-pedidos">
      <HeaderAdm page="pedidos" />
      <h1>Lista de Pedidos</h1>
      <section className="panel">
        <div className="tabela-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Produto Encomendado</th>
                <th>Valor Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido, index) => (
                <tr key={index}>
                  <td>{pedido.id}</td>
                  <td>{pedido.nome}</td>
                  <td>
                    {pedido.produtos.map((produto, i) => (
                      <div key={i}>
                        {produto.quantidade}x {produto.nome}
                      </div>
                    ))}
                  </td>
                  <td>R$ {pedido.preco}</td>
                  <td>
                    {pedido.status === "Pendente" ? (
                      <span className="status pendente" onClick={()=>alterarStatus(pedido.id,pedido)}>Pendente</span>
                    ) : (
                      <span className="status entregue" onClick={()=>alterarStatus(pedido.id,pedido)}>Entregue</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
