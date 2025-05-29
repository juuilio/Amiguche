import connection from "./Connection.js";

export async function listarClientes() {
  const comando = `SELECT * FROM clientes`;
  const [rows] = await connection.query(comando);
  return rows;
}

export async function criarCliente(cliente) {
  const comando = `INSERT INTO clientes (nome, email, senha, rua, cidade, estado, cep) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const [rows] = await connection.query(comando, [cliente.nome, cliente.email, cliente.senha, cliente.rua, cliente.cidade, cliente.estado, cliente.cep]);
  return rows.insertId;
}

export async function alterarCliente(cliente) {
  const comando = `UPDATE clientes SET nome = ?, email = ?, senha = ?, endereco = ?, cidade = ?, estado = ?, cep = ? WHERE id_cliente = ?`;
  const [rows] = await connection.query(comando, [cliente.nome, cliente.email, cliente.senha, cliente.endereco, cliente.cidade, cliente.estado, cliente.cep, cliente.id_cliente]);
  return rows.affectedRows;
}

export async function removerCliente(id_cliente) {
  const comando = `DELETE FROM clientes WHERE id_cliente = ?`;
  const [rows] = await connection.query(comando, [id_cliente]);
  return rows.affectedRows;
}

export async function buscarClientePorId(id_cliente) {
  const comando = `SELECT * FROM clientes WHERE id_clientes = ?`;
  const [rows] = await connection.query(comando, [id_cliente]);
  return rows[0];
}

export async function buscarCliente(cliente) {
  const comando = `SELECT * FROM clientes WHERE email = ? AND senha = ?`;
  const [rows] = await connection.query(comando, [cliente.email, cliente.senha]);
  if (rows.length === 0) {
    return null;
  }
  return rows[0];
  
}

