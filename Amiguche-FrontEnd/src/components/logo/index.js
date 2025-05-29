import "./index.scss";
import { useState, useEffect } from "react";

export default function Logo(props) {
  const [imagem, setImagem] = useState("126px"); 
  const [fonte, setFonte] = useState("29px");    

  useEffect(() => {
    if (props.imagem) setImagem(props.imagem);
    if (props.fonte) setFonte(props.fonte);
  }, [props.imagem, props.fonte]);

  return (
    <div className="Component-logo" style={props.style}>
      <img src="/images/logobear.png" alt="Logo" style={{ width: imagem }} />
      <h2 style={{ fontSize: fonte }}>Amiguche</h2>
    </div>
  );
}
