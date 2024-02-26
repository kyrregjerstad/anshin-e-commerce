export function getLocalCart() {
  try {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    return cart;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export function setLocalCart(cartItems: []) {
  try {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  } catch (error) {
    console.error(error);
  }
}

export function clearLocalCart() {
  try {
    localStorage.removeItem('cart');
  } catch (error) {
    console.error(error);
  }
}
