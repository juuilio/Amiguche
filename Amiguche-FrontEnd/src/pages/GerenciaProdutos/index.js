import React from "react";
import DetProduto from "../../components/detProduto";
import HeaderAdm from "../../components/headerAdm";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "./index.scss";

import { useState, useEffect } from "react";

export default function GerenciaProdutos() {
  const [isOpen, setIsOpen] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [idProduto, setIdProduto] = useState(0);

  // Exibição dos dados

  async function buscarProdutos() {
    let url = "http://localhost:5000/produto";
    let resp = await axios.get(url);
    return resp.data;
  }

  async function buscarVariante(id) {
    try {
      const url = `http://localhost:5000/variantes/produto/${id}`;
      const resp = await axios.get(url);
      return resp.data[0] || null;
    } catch (err) {
      console.error("Erro ao buscar variante:", err);
      return null;
    }
  }

  async function buscarImagem(id_produto, id_variante) {
    if (!id_variante) return null;
    try {
      const url = `http://localhost:5000/imagem/produto/${id_produto}/variante/${id_variante}`;
      const resp = await axios.get(url);
      return resp.data;
    } catch (err) {
      console.error("Erro ao buscar imagem:", err);
      return null;
    }
  }

  async function montarProdutos() {
    const produtosBase = await buscarProdutos();

    const lista = await Promise.all(
      produtosBase.map(async (produto) => {
        const variante = await buscarVariante(produto.id_produto);
        const imagemData = await buscarImagem(
          produto.id_produto,
          variante?.id_variantes
        );

        return {
          id: produto.id_produto,
          nome: produto.nome,
          preco: variante?.preco ?? "N/A",
          descricao: variante?.descricao ?? "Sem descrição",
          imagem: imagemData?.imagens ?? null,
          tipo: imagemData?.tipo ?? null,
        };
      })
    );

    return lista;
  }

  async function carregar() {
    const lista = await montarProdutos();

    // Evita setar o estado se a lista for a mesma
    if (produtos !== lista) 
      setProdutos(lista);
    
  }

  // Excluir Produto
  async function excluirProduto(id) {
    let url = "http://localhost:5000/produto/" + id;
    let imgs = await excluirImagens(id);
    let vari = await excluirVariantes(id);
    if (imgs !== 1 && vari !== 200) {
      toast.error("Erro ao excluir imagens ou variantes");
    } else {
      let resp = await axios.delete(url);
      console.log("Resposta: ", resp);
      if (resp.status === 200) {
        toast("Produto excluído com sucesso");
        // carregar();
      } else toast.error("Erro ao excluir produto");
    }
  }

  async function excluirVariantes(id) {
    try {
      let url = "http://localhost:5000/variantes/produto/"+id;
      let resp = await axios.delete(url);
      return resp.status;
    } catch (e) {
      console.log("Erro ao excluir variantes: ", e);
      return;
    }
  }

  async function buscarImagens(id) {
    try {
      let url = "http://localhost:5000/imagem/produto/" + id;
      let resp = await axios.get(url);
      if (resp.status === 404) {
        console.log("Imagens não encontradas");
        return null;
      }
      return resp.data; // Array de JSON
    } catch (e) {
      console.log("Erro ao buscar imagens: ", e);
      return null;
    }
  }

  async function excluirImagens(id) {
    try {
      let idimagem;
      let url = "http://localhost:5000/imagem/";
      let imagens = await buscarImagens(id);
      if (imagens !== null) {
        for (let i = 0; i < imagens.length; i++) {
          idimagem = imagens[i].id_imagens;
          await axios.delete(url + idimagem);
          console.log("Excluindo imagem: ", idimagem);
        }
        return 1;
      }
    } catch (e) {
      console.log("Erro ao excluir imagens: ", e);
      return;
    }
  }

  useEffect(() => {
    carregar();
  }, [carregar()]);

  return (
    <main className="gerencia-produtos">
      <ToastContainer />
      <HeaderAdm page="produtos" />
      <DetProduto
        id={idProduto}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
      <section className="titulo">
        <div>
          <Link to="/admin">Voltar</Link>
          <h1>Produtos</h1>
          <button
            className="btn-cadastro"
            onClick={() => {
              setIdProduto(0);
              setIsOpen(true);
            }}
          >
            Novo Produto
          </button>
        </div>
      </section>

      <section className="panel">
        <div className="tabela-container">
          <table>
            <thead>
              <tr>
                <th>Nome do Produto</th>
                <th>Preço</th>
                <th>Descrição do Produto</th>
                <th>Imagem (jpg, png)</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.length === 0 ? (
                <tr>
                  <td colSpan="5">Carregando produtos...</td>
                </tr>
              ) : (
                produtos.map((item) => (
                  <tr key={item.id}>
                    <td>{item.nome}</td>
                    <td>R$ {item.preco}</td>
                    <td>{item.descricao}</td>
                    <td>
                      <img
                        src={`http://localhost:5000/${item.imagem}`}
                        alt={item.nome}
                      />
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          setIdProduto(item.id);                        
                          setIsOpen(true);
                        }}
                        className="btn-editar"
                      >
                        Editar
                      </button>
                      <button
                        className="btn-excluir"
                        onClick={() => excluirProduto(item.id)}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
