import * as produtoRepository from "../Repositories/produtoRepository.js";
import { removerVariantes, buscarVariantesPorProduto } from "../Repositories/variantesRepository.js";
import { removerImagem,buscarImagemPorProduto } from "../Repositories/imagensRepository.js";
import { Router } from "express";
const endpoints = Router();

endpoints.get("/produto", async (req, resp) => {
  let registros = await produtoRepository.listarProdutos();
  resp.send(registros);
});

endpoints.get("/produto/:id",async (req,resp)=>{
  let id = req.params.id;
  let registro=await produtoRepository.buscarProdutoPorId(id);
  resp.send(registro);
})

endpoints.get("/produto/novidades/:qtd", async (req, resp) => {
  try {
    let qtd = Number(req.params.qtd); 
    if (isNaN(qtd)) qtd = 6; // Valor padrão se não for número
    
    let registros = await produtoRepository.listarNovidades(qtd);
    resp.send(registros);
    
  } catch (e) {
    resp.status(500).send({ 
      message: "Erro ao listar novidades",
      error: e.message 
    });
    console.log("Erro:", e);
  }
});

endpoints.post("/produto", async (req, resp) => {
  let produto = req.body;

  let novoId = await produtoRepository.criarProduto(produto);
  resp.send({ novoId });
});

endpoints.put("/produto/:id", async (req, resp) => {
  let id = req.params.id;
  let produto = req.body;

  await produtoRepository.alterarProduto(id, produto);
  resp.send({ message: "Produto atualizado com sucesso" });
});

endpoints.delete("/produto/:id", async (req, resp) => {
  try{
    let id = req.params.id;
    await produtoRepository.removerProduto(id);

    resp.status(200).send({ message: "Produto removido com sucesso" });
  }catch(erro){
    resp.status(400).send({message: erro.message});
  }
});

export default endpoints;