const onBuyProduct = (value) => {
  if (value) {
    localStorage.setItem("productCart", JSON.stringify(value));
  }
};

const onGetProductCart = () => {
  const productCart = localStorage?.getItem("productCart");
  return JSON.parse(productCart)
};

const onClearProductCart = () => {
  localStorage.removeItem("productCart");
}

export { onBuyProduct, onGetProductCart, onClearProductCart };
