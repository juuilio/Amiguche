import React from 'react';
import HeaderAdm from '../../components/headerAdm'
import { ToastContainer } from 'react-toastify';
import './index.scss'

export default function Admin() {
    return (
        <main className="admin">
            <ToastContainer/>
            <HeaderAdm/>
            <div className='content'>
                <h1>Área Administrativa</h1>
                <div className='cards'>
                    <div className='card'>
                        <h2>Produtos cadastrados</h2>
                        <div className='card-content'>
                            <h3>30</h3>
                            <button>Ver todos</button>

                        </div>
                    </div>
                    <div className='card'>
                        <h2>Pedidos Entregues</h2>
                        <div className='card-content'>
                            <h3>3</h3>
                            <button>Ver todos</button>
                        </div>
                    </div>
                    <div className='card'>
                        <h2>Pedidos Pendentes</h2>
                        <div className='card-content'>
                            <h3>10</h3>
                            <button>Ver todos</button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}