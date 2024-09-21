import React, { useState } from "react";
import ProductList from "./components/ProductList";
import ProductPicker from "./components/ProductPicker";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const handleAddProduct = (selectedProducts) => {
    console.log(selectedProducts, "selectedProducts");

    if (products.length || selectedProducts.length) {
      setProducts([...products, ...selectedProducts]);
    } else setIsPickerOpen(true);
  };

  const handleProductReplace = (selectedProducts) => {
    if (editIndex !== null) {
      const updatedProducts = [...products];
      updatedProducts.splice(editIndex, 1, ...selectedProducts);
      setProducts(updatedProducts);
      setIsPickerOpen(false);
      setEditIndex(null);
    }
  };

  return (
    <div className="App">
      <h1>Product List</h1>
      <ProductList
        products={products}
        setProducts={setProducts}
        openPicker={(index) => {
          setEditIndex(index);
          setIsPickerOpen(true);
        }}
      />
      <button onClick={() => setIsPickerOpen(true)}>Add Product</button>
      {isPickerOpen && (
        <ProductPicker
          onProductSelect={handleProductReplace}
          updateProducts={handleAddProduct}
          onClose={() => setIsPickerOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
