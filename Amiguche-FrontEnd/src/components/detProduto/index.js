import React from "react";
import { useEffect, useState } from "react";

import axios from "axios";
import "./index.scss";
import { toast, ToastContainer } from "react-toastify";
import { NumericFormat } from "react-number-format";

export default function DetProduto({ isOpen, onClose, ...props }) {
  //Produto
  const [idProduto, setIdProduto] = useState(props.id);
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [descricao, setDescricao] = useState("");
  const [img, setImage] = useState();

  useEffect(() => {
    setIdProduto(props.id);
  }, [props.id]);

  useEffect(() => {
    if (idProduto !== 0) {
      montarProduto();
    } else {
      // novo produto
      setNome("");
      setPreco("");
      setDescricao("");
      setImage(undefined);
    }
  }, [idProduto]);

  //Exibição dos dados
  async function buscarNome() {
    let url = "http://localhost:5000/produto/" + idProduto;
    let resp = await axios.get(url);
    return resp.data.nome;
  }

  async function buscarVariante() {
    try {
      const url = `http://localhost:5000/variantes/produto/${idProduto}`;
      const resp = await axios.get(url);
      return resp.data[0] || null;
    } catch (err) {
      console.error("Erro ao buscar variante:", err);
      return null;
    }
  }

  async function buscarImagemProdutoVariante() {
    try {
      const variante = await buscarVariante(idProduto);
      const url = `http://localhost:5000/imagem/produto/${idProduto}/variante/${variante.id_variantes}`;
      const resp = await axios.get(url);
      return resp.data.imagens;
    } catch (err) {
      console.error("Erro ao buscar imagem:", err);
      return null;
    }
  }

  async function buscarImagemProduto(id) {
    try {
      const url = `http://localhost:5000/imagem/produto/${id}`;
      const resp = await axios.get(url);
      return resp.data;
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
      setDescricao(variante.descricao);
    }

    const imagem = await buscarImagemProdutoVariante();
    if (imagem && typeof imagem === "string") {
      setImage(`http://localhost:5000/${imagem}`);
    }
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
    try {
      let urlProduto = "http://localhost:5000/produto"; //nome
      let urlVariante = "http://localhost:5000/variantes"; // Preço e Descrição

      let respProduto = await axios.post(urlProduto, {
        nome: nome,
      });

      let respVariante = await axios.post(urlVariante, {
        descricao: descricao,
        preco: parseFloat(preco),
        id: respProduto.data.novoId,
      });

      await cadastrarImagem(respProduto.data.novoId, respVariante.data.novoId);

      toast.success("Produto cadastrado com sucesso!");
      setNome("");
      setPreco("");
      setDescricao("");
      setImage(undefined);
      setIdProduto(0);
    } catch (err) {
      console.error("Erro ao cadastrar produto:", err);
    }
  }

  async function cadastrarImagem(idProduto, idVariante) {
    if (img && typeof img !== "string") {
      const urlImagem = `http://localhost:5000/imagem/${idProduto}/${idVariante}`;
      const imagemForm = new FormData();
      imagemForm.append("imagem", img);

      await axios.post(urlImagem, imagemForm, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
  }

  //Alterar produto
  async function alterarProduto(id) {
    let url = "http://localhost:5000/produto/" + id;
    let vari = await alterarVariantes(id);
    let imag = await alterarImagem(id);
    let resp = await axios.put(url, {
      nome: nome,
    });
    if (resp.status === 200 && vari === 200 && imag === 200)
      toast.success("Produto alterado com sucesso", {
        autoClose: 1000,
        onClose: () => {
          onClose();
        },
      });
    else toast.error("Erro ao alterar produto");
  }

  async function alterarVariantes(id) {
    let idVariante = await buscarVariante(id);
    let url = "http://localhost:5000/variantes/" + idVariante.id_variantes;
    console.log("Alterando variante: ", id);
    console.log("Descrição: ", descricao);
    console.log("Preço: ", preco);
    let resp = await axios.put(url, {
      descricao: descricao,
      preco: parseFloat(preco),
      id: id,
    });
    console.log("Resposta: ", resp);
    return resp.status;
  }

  async function alterarImagem(id) {
    if (!img || typeof img === "string") {
      // Não atualiza imagem se ela não foi alterada
      return 200;
    }

    let idImg = await buscarImagemProduto(id);
    if (!idImg || !idImg[0]) {
      // Criar nova imagem, já que não possui uma cadastrada
      let variante = await buscarVariante(id);
      await cadastrarImagem(id, variante.id_variantes);
      return 200;
    } else {
      // Alterar imagem existente
      let url = "http://localhost:5000/imagem/" + idImg[0].id_imagens;
      let imagemForm = new FormData();
      imagemForm.append("imagem", img);

      let resp = await axios.put(url, imagemForm, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return resp.status;
    }
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
      if (resp.status === 200) {
        toast("Produto excluído com sucesso");
      } else toast.error("Erro ao excluir produto");
    }
  }

  async function excluirVariantes(id) {
    try {
      let url = "http://localhost:5000/variantes/produto/" + id;
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

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <ToastContainer />
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <section className="detalhes-produto">
          <div className="sec1">
            <div>
              {/* <Link> */}
              <h2 onClick={onClose}>Voltar</h2>
              {/* </Link> */}
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
                accept="image/*"
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
                <NumericFormat
                  id="preco"
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="R$ "
                  value={preco}
                  onValueChange={(values) => {
                    const { formattedValue, value, floatValue } = values;
                    setPreco(floatValue ?? "");
                  }}
                  allowNegative={false}
                  decimalScale={2}
                  fixedDecimalScale={true}
                  inputMode="decimal"
                  className="preco-input"
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
            {idProduto === 0 ? (
              <button
                onClick={() => {
                  cadastrarProduto();
                }}
              >
                Cadastrar
              </button>
            ) : (
              <button
                onClick={() => {
                  alterarProduto(idProduto);
                }}
              >
                Alterar
              </button>
            )}
            {idProduto !== 0 ? (
              <button
                onClick={() => {
                  excluirProduto(idProduto);
                }}
              >
                Excluir
              </button>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
