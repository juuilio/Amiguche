import { useState } from "react";

import Logo from "../../components/logo";
import { Link } from "react-router-dom";
import "./index.scss";
import { useEffect } from "react";

export default function Header2(props) {
  const [ link, setLink ] = useState("/");

  useEffect(() => {
    if (props.link) setLink(props.link);
  }, [props.voltar]);

  return (
    <section className="header2">
      <Link to={link} className="nav-item">
        Voltar
      </Link>
      <Logo imagem={"6em"} fonte={"25px"} style={{ color: "#4f2c14" }} />
    </section>
  );
}
