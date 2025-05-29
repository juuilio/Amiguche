import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter,Route,Routes } from 'react-router-dom';

import './index.css';

import App from './App';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import GerenciaProdutos from './pages/GerenciaProdutos';
import ListaPedidos from './pages/ListaPedidos';
import Admin from './pages/Admin';

import Produto from './components/produto';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="*" element={<App />} />
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path='/cadastro' element={<Cadastro />}/>
      <Route path='/c' element={<Produto />}/>
      <Route path='/admin/pedidos' element={<ListaPedidos/>} />
      <Route path='/admin/produtos' element={<GerenciaProdutos/>} />
      <Route path='/admin' element={<Admin/>} />
    </Routes>
  </BrowserRouter>

);


