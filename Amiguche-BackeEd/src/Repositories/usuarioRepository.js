import connection from "./Connection.js";

export async function listarUsuario() {
  const comando = `SELECT * FROM usuarios`;
  const [rows] = await connection.query(comando);
  return rows;
}

export async function buscarUsuario(usuario){
  const comando=`SELECT * FROM usuarios WHERE usuario = ? and senha = ?`;
  const [rows] = await connection.query(comando, [usuario.usuario, usuario.senha]);
  if(rows.length === 0){
    return null;
  }
  return rows[0];
}

export async function criarUsuario(usuario) {
  const comando = `INSERT INTO usuarios (usuario, senha) VALUES (?, ?)`;
  const [rows] = await connection.query(comando, [usuario.usuario, usuario.senha]);
  return rows.insertId;
}

export async function alterarUsuario(usuario) {
  const comando = `UPDATE usuarios SET usuario = ?, senha = ? WHERE id_usuario = ?`;
  const [rows] = await connection.query(comando, [usuario.usuario, usuario.senha, usuario.id_usuario]);
  return rows.affectedRows;
}