import { Router } from "express";
import multer from "multer";
import * as imagemRepository from "../Repositories/imagensRepository.js";

const endpoints = Router();

// Configuração do Multer para armazenamento local
const uploadImagem = multer({
  dest: "./storage",
});

// POST - Cadastrar imagem
endpoints.post(
  "/imagem/:id_produto/:id_variantes",
  uploadImagem.single("imagem"),
  async (req, resp) => {
    try {
      const imagem = req.file;
      if (!imagem) {
        return resp.status(400).send({ message: "Nenhuma imagem enviada." });
      }

      const novaImagem = {
        caminho: imagem.path,
        tipo: imagem.mimetype,
        id_produto: req.params.id_produto,
        id_variantes: req.params.id_variantes,
      };

      const novoId = await imagemRepository.enviarImagem(novaImagem);

      resp.status(201).send({
        id: novoId,
        message: "Imagem cadastrada com sucesso",
      });
    } catch (err) {
      console.error(err);
      resp.status(500).send({ message: "Erro ao cadastrar imagem" });
    }
  }
);

// DELETE - Remover imagem por ID
endpoints.delete("/imagem/:id", async (req, resp) => {
  try {
    const id = req.params.id;
    const removed = await imagemRepository.removerImagem(id);

    if (!removed) {
      return resp.status(404).send({ message: "Imagem não encontrada" });
    }

    resp.send({ message: "Imagem removida com sucesso" });
  } catch (err) {
    console.error(err);
    resp.status(500).send({ message: "Erro ao remover imagem" });
  }
});

// GET - Buscar imagem por ID
endpoints.get("/imagem/:id", async (req, resp) => {
  try {
    const id = req.params.id;
    const imagem = await imagemRepository.buscarImagemPorId(id);

    if (!imagem) {
      return resp.status(404).send({ message: "Imagem não encontrada" });
    }

    resp.send(imagem);
  } catch (err) {
    console.error(err);
    resp.status(500).send({ message: "Erro ao buscar imagem" });
  }
});

endpoints.get(
  "/imagem/produto/:id_produto",
  async (req, resp) => {
    try {
      const id_produto = req.params.id_produto;
      const imagem = await imagemRepository.buscarImagemPorProduto(id_produto);

      if (!imagem) {
        return resp.status(404).send({ message: "Imagem não encontrada" });
      }

      resp.send(imagem);
    } catch (err) {
      console.error(err);
      resp.status(500).send({ message: "Erro ao buscar imagem" });
    }
  }
)

// GET - Buscar imagem por produto e variante
endpoints.get(
  "/imagem/produto/:id_produto/variante/:id_variante",
  async (req, resp) => {
    try {
      const imagens = await imagemRepository.buscarImagensPorProdutoVariante(
        req.params.id_produto,
        req.params.id_variante
      );

      if (!imagens || imagens.length === 0) {
        return resp.status(404).send({ message: "Nenhuma imagem encontrada" });
      }

      const imagem = imagens[0];

      resp.send({
        imagens: imagem.caminho,
        tipo: imagem.tipo,
      });
    } catch (err) {
      console.error(err);
      resp.status(500).send({ message: "Erro ao buscar imagem" });
    }
  }
);

// GET - Listar todas as imagens
endpoints.get("/imagem", async (req, resp) => {
  try {
    const imagens = await imagemRepository.listarImagens();

    if (!imagens || imagens.length === 0) {
      return resp.status(404).send({ message: "Nenhuma imagem encontrada" });
    }

    resp.send(imagens);
  } catch (err) {
    console.error(err);
    resp.status(500).send({ message: "Erro ao buscar imagens" });
  }
});

// PUT - Atualizar imagem existente
endpoints.put(
  "/imagem/:id",
  uploadImagem.single("imagem"),
  async (req, resp) => {
    try {
      const id = req.params.id;
      const imagem = req.file;

      if (!imagem) {
        return resp.status(400).send({ message: "Nenhuma imagem foi enviada" });
      }

      const updated = await imagemRepository.alterarImagem({
        id_imagem: id,
        caminho: imagem.path,
        tipo: imagem.mimetype,
      });

      if (!updated) {
        return resp.status(404).send({ message: "Imagem não encontrada" });
      }

      resp.send({ message: "Imagem atualizada com sucesso" });
    } catch (err) {
      console.error(err);
      resp.status(500).send({ message: "Erro ao atualizar imagem" });
    }
  }
);

export default endpoints;
