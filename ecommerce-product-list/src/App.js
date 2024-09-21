import React, { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import ProductList from "./components/ProductList";
import ProductPicker from "./components/ProductPicker";

const App = () => {
  const [products, setProducts] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [editProductIndex, setEditProductIndex] = useState(null);

  // Open the picker for adding products (when Add Product button is clicked)
  const handleAddProduct = () => {
    setEditProductIndex(null); // Since it's adding, not editing
    setShowPicker(true); // Open the picker
  };

  // Open the picker for editing a product
  const handleEditProduct = (index) => {
    setEditProductIndex(index);
    setShowPicker(true); // Open the picker with the product to edit
  };

  // Handle the closing of ProductPicker and updating the product list
  const handlePickerClose = (selectedProducts) => {
    // Ensure no duplicates by filtering out already added products
    const filteredSelectedProducts = selectedProducts.filter(
      (newProduct) =>
        !products.some(
          (existingProduct) => existingProduct.id === newProduct.id
        )
    );

    if (filteredSelectedProducts.length > 0) {
      if (editProductIndex !== null) {
        // Editing an existing product
        const updatedProducts = [...products];
        updatedProducts.splice(
          editProductIndex,
          1,
          ...filteredSelectedProducts
        );
        setProducts(updatedProducts);
      } else {
        // Adding new products to the list
        setProducts((prevProducts) => [
          ...prevProducts,
          ...filteredSelectedProducts,
        ]);
      }
    }
    setShowPicker(false); // Close the picker after selection
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(products);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setProducts(items);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="app-container">
        <h1>Product Manager</h1>
        <button className="add-product-btn" onClick={handleAddProduct}>
          Add Product
        </button>
        <ProductList
          products={products}
          onEdit={handleEditProduct}
          setProducts={setProducts}
        />
        {showPicker && (
          <ProductPicker
            onClose={handlePickerClose}
            initialSelectedProducts={
              editProductIndex !== null ? [products[editProductIndex]] : []
            } // Pass in the product to edit (if any)
          />
        )}
      </div>
    </DragDropContext>
  );
};

export default App;
