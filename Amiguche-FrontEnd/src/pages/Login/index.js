import React from "react";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

import Header2 from "../../components/header2";
import { login } from "../../services/loginService.js";
import { ToastContainer, toast } from "react-toastify";

import "./index.scss";

export default function Login() {
  const [email, setEmail] = React.useState("");
  const [senha, setSenha] = React.useState("");
  const [rota, setRota] = React.useState("");

  const navigate= useNavigate();

  async function addLog() {
    if (email === "" || senha === "") {
      toast.error("Preencha todos os campos");
    } else if (email !== "" && senha !== "") {
      let resp = await login(email, senha);
      if (resp === "user") {
        toast("Login realizado com sucesso",{
          onClose: () => navigate("/admin") ,
          autoClose: 1500
        });
      } else if (resp === "client") {
        toast("Login realizado com sucesso",{
          onClose: () => navigate("/") ,
          autoClose: 1500
        });
      } else if (resp === "erro"){
        toast.error("Email ou senha incorretos");
      } 
    }
  }

  return (
    <main className="container-login">
      <ToastContainer />
      <Header2 link="/" />

      <section className="login-form">
        <h1 className="login-title">Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <Link onClick={addLog} className="btn-Link">
          <button className="btn-Login">Login</button>
        </Link>

        <Link to="/cadastro">
          <button className="btn-Cadastro">Criar Conta</button>
        </Link>

        <div className="links">
          <button className="btn-links">
            <Link>
              <FaFacebookF className="icones" />
              <span>Facebook</span>
            </Link>
          </button>

          <button className="btn-links">
            <Link>
              <FaGoogle className="icones" />
              <span>Google</span>
            </Link>
          </button>
        </div>
      </section>
    </main>
  );
}
