import * as variantesRepository from "../Repositories/variantesRepository.js";
import { Router } from "express";
const endpoints = Router();

endpoints.get("/variantes", async (req, resp) => {
  let registros = await variantesRepository.listarVariantes();
  resp.send(registros);
});

endpoints.post("/variantes", async (req, resp) => {
  let variante = req.body; 

  let novoId = await variantesRepository.criarVariantes(variante);
  resp.send({ novoId });
});

endpoints.put("/variantes/:id", async (req, resp) => {
  let id = req.params.id;
  let variante = req.body;

  await variantesRepository.alterarVariantes(id, variante);
  resp.send({ message: "Variantes atualizado com sucesso" });
});

endpoints.delete("/variantes/:id", async (req, resp) => {
  let id = req.params.id;

  await variantesRepository.removerVariantes(id);
  resp.send({ message: "Variantes removido com sucesso" });
});

endpoints.delete("/variantes/produto/:id_produto", async (req, resp) => {
  let id_produto = req.params.id_produto;

  await variantesRepository.removerVariantesProduto(id_produto);
  resp.send({ message: "Variantes removido com sucesso" });
});

endpoints.get("/variantes/:id", async (req, resp) => {
  let id = req.params.id;

  let variantes = await variantesRepository.buscarVariantesPorId(id);
  if (!variantes) {
    return resp.status(404).send({ message: "Variantes não encontrado" });
  }
  resp.send(variantes);
});

endpoints.get("/variantes/produto/:id_produto", async (req, resp) => {
  let id_produto = req.params.id_produto;

  let variantes = await variantesRepository.buscarVariantesPorProduto(id_produto);
  if (!variantes) {
    return resp.status(404).send({ message: "Variantes não encontrado" });
  }
  resp.send(variantes);
});

export default endpoints;