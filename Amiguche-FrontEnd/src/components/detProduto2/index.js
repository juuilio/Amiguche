import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import axios from "axios";
import "./index.scss";

export default function DetProduto({ isOpen, onClose, ...props }) {
  //Aba
  const [btn, setBtn] = useState(<button>Salvar</button>);

  //Produto
  const [nome, setNome] = useState("Amigurumi");
  const [preco, setPreco] = useState(12.34);
  const [descricao, setDescricao] = useState("Descrição do produto");
  const [img, setImage] = useState();

  useEffect(() => {
    if (props.id !== 0) {
      montarProduto();
      setBtn(<button /* onClick={alterarProduto} */>Alterar</button>);
    } else {
      // novo produto
      setNome('');
      setPreco('');
      setDescricao('');
      setImage(undefined);
      setBtn(<button onClick={cadastrarProduto}>Cadastrar</button>);
    }
  }, [props.id]);

  //Exibição dos dados
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

  async function buscarImagem() {
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
    setPreco(buscarVariante().preco);
    setDescricao(buscarVariante().descricao);
    setImage(buscarImagem);
  }

  //Bloco de Imagem
  function escolherImagem(inputId) {
    document.getElementById(inputId).click();
  }

  function exibirImagem(img) {
    if (img === undefined) {
      return "/images/UploadIcon.png";
    } else if (typeof img == "string") {
      return img;
    } else {
      return URL.createObjectURL(img);
    }
  }

  //Cadastro
  async function cadastrarProduto() {
    let urlProduto = "http://localhost:5000/produto"; //nome
    let urlVariante = "http://localhost:5000/variantes"; // Preço e Descrição

    let respProduto = await axios.post(urlProduto, {
      nome: nome
    });

    let respVariante = await axios.post(urlVariante, {
      descricao: descricao,
      preco: preco,
      id: respProduto.data.novoId
    });

    let urlImagem = `http://localhost:5000//imagem/${respProduto.data.novoId}/${respVariante.data.id_variantes}`; // Imagem
    let imagem = new FormData();
    imagem.append("imagem", img);

    let respImg = await axios.post(urlImagem, imagem, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <section className="detalhes-produto">
          <div className="sec1">
            <div>
              <Link>
                <h2 onClick={onClose}>Voltar</h2>
              </Link>
              <h1>Detalhes do Produto</h1>
            </div>
            <hr />
          </div>

          <div className="sec2">
            <div className="sec2-img" onClick={() => escolherImagem("imagem")}>
              <img src={exibirImagem(img)} alt="Imagem do produto" />
              <input
                type="file"
                id="imagem"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>

            <div className="sec2-info">
              <div className="sec2-info-input">
                <label id="nome">Nome: </label>
                <input
                  id="nome"
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>

              <div className="sec2-info-input">
                <label id="preco">Preço: </label>
                <input
                  id="preco"
                  type="number"
                  value={preco}
                  onChange={(e) => setPreco(parseFloat(e.target.value) )}
                />
              </div>

              <div className="sec2-info-area">
                <label id="desc">Descrição: </label>
                <textarea
                  id="desc"
                  cols="30"
                  rows="10"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="sec3">
            {btn}
          </div>
        </section>
      </div>
    </div>
  );
}
