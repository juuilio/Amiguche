const CART_KEY = 'carrinho';

// Retorna o carrinho atual
export function getCart() {
  const data = localStorage.getItem(CART_KEY);
  return data ? JSON.parse(data) : [];
}

// Salva o carrinho
export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Adiciona um item ao carrinho
export function addToCart(item) {
  const cart = getCart();

  // Verifica se o item já está no carrinho
  const existente = cart.find(p => p.id === item.id);
  if (existente) {
    existente.quantidade += item.quantidade;
  } else {
    cart.push(item);
  }

  saveCart(cart);
}

// Remove um item do carrinho
export function removeFromCart(id) {
  const cart = getCart().filter(p => p.id !== id);
  saveCart(cart);
}

// Limpa o carrinho
export function clearCart() {
  localStorage.removeItem(CART_KEY);
}
