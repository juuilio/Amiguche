import axios from "axios";
const LOGIN_KEY = "user";



export function getUser() {
  const data = localStorage.getItem(LOGIN_KEY);
  return data ? JSON.parse(data) : null;
}

export function saveUser(user) {
  localStorage.setItem(LOGIN_KEY, JSON.stringify(user));
}

export function removeUser() {
  localStorage.removeItem(LOGIN_KEY);
}

export function isLoggedIn() {
  return getUser() !== null;
}

export function addUser(user) {
  const data = getUser();
  if (data) {
    removeUser();
  }
  saveUser(user);
}

// export async function login(email, senha) {
//   try {
//     let urlU = "http://localhost:5000/usuario/login";
//     let urlC = "http://localhost:5000/cliente/login";
//     console.log("teste 4");
//     let resp = await axios.post(urlU, {
//       usuario: email,
//       senha,
//     });
//     console.log("teste 5 + ",resp);
//     if (resp.status === 200) {
//       addUser({
//         role: "user",
//         id: resp.data.id_usuarios,
//       });
//       return "user"
//     }
//     console.log("teste 6 + ");
//     resp = await axios.post(urlC,{email, senha});
//     console.log("teste 7 + ",resp);
//     if (resp.status === 200) {
//       addUser({
//         role: "client",
//         id: resp.data.id_clientes,
//       });
//       return "client";
//     }
//     console.log("teste 8");
//     return "erro"; // Nenhum login funcionou
//   } catch (err) {
    
//     console.error("Erro ao fazer login:", err);
//   }
// }

export async function login(email, senha) {
  try {
    const respU = await axios.post("http://localhost:5000/usuario/login", {
      usuario: email,
      senha,
    });
    if (respU.status === 200) {
      addUser({
        role: "user",
        id: respU.data.id,
      });
      return "user";
    }
  }catch (err) {
    // Ignora erro e tenta o próximo
  }

  try {
    const respC = await axios.post("http://localhost:5000/cliente/login", {
      email,
      senha,
    });
    if (respC.status === 200) {
      addUser({
        role: "client",
        id: respC.data.id,
      });
      return "client";
    }
  } catch (err) {
    // Ignora erro e tenta o próximo
  }
  removeUser();
  return "erro"; // Nenhum login funcionou
}

export function logout() {
  removeUser(); // Usa a função já existente no service
}

export async function cadastrar(cliente){
  const url= "http://localhost:5000/cliente";
  let resp = await axios.post(url, cliente);
  if(resp.status === 200)  return true;
  else return false;
}