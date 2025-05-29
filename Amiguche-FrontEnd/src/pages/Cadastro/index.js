import React from "react";
import Header2 from "../../components/header2";
import { Link } from "react-router-dom";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import { cadastrar } from "../../services/loginService.js";

import "./index.scss";

function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [rua, setRua] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [cep, setCep] = useState("");

  async function cadastro(){
    if(senha !== confirmarSenha){
      toast.error("As senhas não coincidem");
      return;
    }else if(
      nome === "" || 
      email === "" || 
      senha === "" || 
      confirmarSenha === "" || 
      rua === "" || 
      cidade === "" || 
      estado === "" || 
      cep === ""){  
      toast.error("Preencha todos os campos");
      return;
    }
    let cliente={
      nome,
      email,
      senha,
      rua,
      cidade,
      estado,
      cep
    }

    let resp = await cadastrar(cliente);
    if(resp){
      toast.success("Cadastro realizado com sucesso",{
        onClose: () => window.location.href = "/login",
        autoClose: 1500
      });
    }else{
      toast.error("Erro ao cadastrar");
    }
  }


  return (
    <main className="conatainer-cadastro">
      <ToastContainer/>
      <Header2 link="/login" />

      <section className="login-box">
        <h2 className="title">Cadastro</h2>
        <div className="login-form">
          <div className="input-box">
            <input
              type="text"
              placeholder="Nome Completo"
              className="input-linha"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="input-linha"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Senha"
              className="input-linha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirmar Senha"
              className="input-linha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
            />
          </div>

          <div className="input-box">
            <input
              type="text"
              placeholder="Rua"
              className="input-linha"
              value={rua}
              onChange={(e) => setRua(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Cidade"
              className="input-linha"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Estado"
              className="input-linha"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Cep"
              className="input-linha"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              required
            />
          </div>
        </div>

        <button className="btn-Login" onClick={cadastro}>
          Cadastrar-se
        </button>
      </section>
    </main>
  );
}

export default Cadastro;
