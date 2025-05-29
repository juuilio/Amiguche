import Logo from "../logo/index.js";
import { Link } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
import { useState, useEffect } from "react";

import "./index.scss";

export default function HeaderAdm(props) {
  const [produtos, setProdutos] = useState("btnArea");
  const [pedidos, setPedidos] = useState("btnArea");

  useEffect(() => {
    if (props.page === "produtos") {
      setProdutos("btnAtivo");
      setPedidos("btnArea");
    } else if (props.page === "pedidos") {
      setPedidos("btnAtivo");
      setProdutos("btnArea");
    }
  },[props.page]);

  return (
    <section className="headerAdm">
      <Link to="/">
        <Logo style={{ flexDirection: "row" }} imagem="75px" fonte="27px" />
      </Link>

      <div className="botoes">
        <Link to="/admin/produtos" className="link">
          <button className={produtos}>Gerenciamento de Produtos</button>
        </Link>

        <Link to="/admin/pedidos" className="link">
          <button className={pedidos}>Lista de Pedidos</button>

        </Link>

       
      </div>

      <div className="admin">
        <FaUserAlt className="icone"/>
        <h2>Admin</h2>
      </div>
    </section>
  );
}
