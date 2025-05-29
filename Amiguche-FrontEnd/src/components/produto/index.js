import React, { useEffect } from "react";
import { useState } from "react";
import DetProduto from "../detProduto";
import "./index.scss";

import { ToastContainer,toast } from "react-toastify";
import { addToCart } from "../../services/carrinhoService.js";

import axios from "axios";

export default function Produto(props) {
  const [nome, setNome] = useState("");
  const [imagem, setImagem] = useState("");
  const [preco, setPreco] = useState("");
  // const [isOpen, setIsOpen] = useState(false);
  
  function addCarrinho(){
    if (props.id) {
      addToCart({
        id:props.id,
        imagem:imagem,
        nome:nome,
        preco:preco,
        quantidade:1
      })
      toast("Produto adicionado ao carrinho",{
        autoClose: 900,
      });
    }
  }
  
  async function buscarNome() {
    let url = "http://localhost:5000/produto/" + props.id;
    let resp = await axios.get(url);
    return resp.data.nome;
  }
  
  async function buscarVariante() {
    try {
      const url = `http://localhost:5000/variantes/produto/${props.id}`;
      const resp = await axios.get(url);
      return resp.data[0] || null;
    } catch (err) {
      console.error("Erro ao buscar variante:", err);
      return null;
    }
  }

  async function buscarImagemProdutoVariante() {
    try {
      const variante = await buscarVariante(props.id);
      const url = `http://localhost:5000/imagem/produto/${props.id}/variante/${variante.id_variantes}`;
      const resp = await axios.get(url);
      return resp.data.imagens;
    } catch (err) {
      console.error("Erro ao buscar imagem:", err);
      return null;
    }
  }

  async function montarProduto() {
    setNome(await buscarNome());

    const variante = await buscarVariante();
    if (variante) {
      setPreco(variante.preco);
    }
    
    const img = await buscarImagemProdutoVariante();
    if (img && typeof img === "string") {
      setImagem(`http://localhost:5000/${img}`);
      // console.log(imagem);
    }
  }

  useEffect(() => {
    if(props.id)
      montarProduto();
  }, [props.id]);

  return (
    <div className="c-produto">
      {/* <DetProduto isOpen={isOpen} onClose={() => setIsOpen(false)} /> */}
      <div className="pos1">
        <img src={imagem} alt="imagem do produto" />
        <h2 className="titulo">{nome}</h2>
        <h2 className="preco">R$ {preco}</h2>
      </div>

      <div className="pos2">
        <button className="btn1" onClick={addCarrinho}>Comprar</button>
        <button className="btn2">Veja Mais</button>
      </div>
    </div>
  );
}
