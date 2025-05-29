import connection from "./Connection.js";

export async function listarPedidos() {
  const comando = `SELECT 
id_pedidos as id,
precoTotal as preco,
status, nome
 FROM pedidos inner join clientes on pedidos.id_clientes=clientes.id_clientes;`;
  const [rows] = await connection.query(comando);
  return rows;
}

export async function listarPedidosPorCliente(id) {
  const comando = `SELECT * FROM pedidos WHERE id_clientes = ?`;
  const [rows] = await connection.query(comando, [id]);
  return rows;
}

export async function criarPedido(pedido) {
  const comando = `INSERT INTO pedidos (data_pedido,precoTotal,status, id_clientes) VALUES (?, ?, ?, ?)`;
  const [rows] = await connection.query(comando, [
    pedido.data,
    pedido.preco,
    pedido.status,
    pedido.id_cliente,
  ]);
  return rows.insertId;
}

export async function adicionarProduto(produto) {
  const comando = `INSERT INTO pedidos_produtos (quantidade,id_pedidos, id_produto) VALUES (? ,?, ?)`;
  const [rows] = await connection.query(comando, [
    produto.qtd,
    produto.id,
    produto.id_produto,
  ]);
  return rows.insertId;
}

export async function buscarProdutos(id) {
  const comando = `SELECT nome, quantidade 
FROM pedidos_produtos 
INNER JOIN produto ON pedidos_produtos.id_produto = produto.id_produto 
WHERE id_pedidos = ?`;
  const [rows] = await connection.query(comando, [id]);
  return rows;
}

export async function alterarPedido(pedido, id) {
  const comando = `UPDATE pedidos SET precoTotal = ?, status = ? WHERE id_pedidos = ?`;
  const [rows] = await connection.query(comando, [
    pedido.preco,
    pedido.status,
    id,
  ]);
  return rows.affectedRows;
}

export async function deletarPedido(id) {
  const comando = `DELETE FROM pedidos WHERE id_pedidos = ?`;
  const [rows] = await connection.query(comando, [id]);
  return rows.affectedRows;
}
