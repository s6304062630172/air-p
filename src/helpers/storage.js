const onBuyProduct = (value) => {
  if (value) {
    localStorage.setItem("productCart", JSON.stringify(value)); /// ส่งค่า value มาเก็บ ใน local storage
  }
};

const onGetProductCart = () => {  /////เมื่อมีคนเรียกใช้ OnGetProductCart
  const productCart = localStorage?.getItem("productCart"); ///productCart ดึงข้อมูลจาก local storage มาใส่
  return JSON.parse(productCart) ///ส่ง productCart ในรูปแบบ ข้อมูลแบบ Json ไปเป็น ข้อมูลเป็น javascrip
};

const onClearProductCart = () => {
  localStorage.removeItem("productCart"); /// นำข้อมูลออกจาก local storage 
}

export { onBuyProduct, onGetProductCart, onClearProductCart };
