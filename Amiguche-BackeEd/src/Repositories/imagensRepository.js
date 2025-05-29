import connection from "./Connection.js";


export async function enviarImagem(imagem) {
    const comando = `INSERT INTO imagens (caminho,tipo, id_variantes, id_produto) VALUES (?, ?, ?, ?)`;
    const [rows] = await connection.query(comando, [imagem.caminho,imagem.tipo, imagem.id_variantes, imagem.id_produto]);
    return rows.insertId;
}


export async function buscarImagemPorId(id_imagem) {
    const comando = `SELECT * FROM imagens WHERE id_imagens = ?`;
    const [rows] = await connection.query(comando, [id_imagem]);
    return rows[0];
}

export async function buscarImagemPorProduto(id_produto) {
    const comando = `SELECT * FROM imagens WHERE id_produto = ?`;
    const [rows] = await connection.query(comando, [id_produto]);
    return rows;
}

export async function buscarImagensPorProdutoVariante(id_produto, id_variante) {
    let comando = `
        SELECT id_imagens, caminho, tipo
        FROM imagens 
        WHERE id_produto = ? AND id_variantes = ?
    `;
    let [linhas] = await connection.query(comando, [id_produto, id_variante]);
    return linhas;
}

export async function listarImagens() {
    const comando = `SELECT * FROM imagens`;
    const [rows] = await connection.query(comando);
    return rows;
}

export async function removerImagem(id_imagem) {
    const comando = `DELETE FROM imagens WHERE id_imagens = ?`;
    const [rows] = await connection.query(comando, [id_imagem]);
    return rows.affectedRows;
}

export async function alterarImagem(imagem) {
    const comando = `UPDATE imagens SET caminho = ?, tipo=? WHERE id_imagens = ?`;
    const [rows] = await connection.query(comando, [imagem.caminho,imagem.tipo, imagem.id_imagem]);
    return rows.affectedRows;
}

