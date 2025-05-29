import usuario from './Controller/usuarioController.js';
import cliente from './Controller/clienteController.js';
import pedidos from './Controller/pedidosController.js';
import produto from './Controller/produtoController.js';
import variantes from './Controller/variantesController.js';
import imagem from './Controller/imagemController.js';

export default function adcionarRotas(server){
    server.use(usuario);
    server.use(cliente);
    server.use(pedidos);
    server.use(produto);
    server.use(variantes);
    server.use(imagem);
}