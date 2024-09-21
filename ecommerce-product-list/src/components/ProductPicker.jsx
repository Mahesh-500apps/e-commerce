import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductPicker = ({ onClose, initialSelectedProducts = [] }) => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedProducts, setSelectedProducts] = useState(
    initialSelectedProducts
  );

  // Load products (with pagination and search)
  const loadProducts = async () => {
    const response = await axios.get(
      `task/products/search?search=${search}&page=${page}&limit=10`,
      { headers: { "x-api-key": "72njgfa948d9aS7gs5" } }
    );
    const newProducts = response.data.filter(
      (newProduct) =>
        !selectedProducts.some(
          (existingProduct) => existingProduct.id === newProduct.id
        )
    );
    setProducts((prev) => [...prev, ...newProducts]);
  };

  useEffect(() => {
    loadProducts();
  }, [page, search]);

  // Handle product selection/deselection
  const handleProductSelect = (product) => {
    const isSelected = selectedProducts.some((p) => p.id === product.id);
    if (isSelected) {
      setSelectedProducts((prev) => prev.filter((p) => p.id !== product.id));
    } else {
      const productWithAllVariants = {
        ...product,
        variants: product.variants.map((v) => ({ ...v, selected: true })),
      };
      setSelectedProducts([...selectedProducts, productWithAllVariants]);
    }
  };

  // Handle variant selection/deselection within a product
  const handleVariantSelect = (product, variantIndex) => {
    const selectedProduct = selectedProducts.find((p) => p.id === product.id);

    if (selectedProduct) {
      const updatedVariants = selectedProduct.variants.map((variant, i) => {
        if (i === variantIndex) {
          return { ...variant, selected: !variant.selected };
        }
        return variant;
      });

      const isAnyVariantSelected = updatedVariants.some((v) => v.selected);

      if (isAnyVariantSelected) {
        // If any variant is selected, update the product with the new variant state
        const updatedProduct = {
          ...selectedProduct,
          variants: updatedVariants,
        };
        setSelectedProducts(
          selectedProducts.map((p) =>
            p.id === product.id ? updatedProduct : p
          )
        );
      } else {
        // If no variant is selected, remove the product from the selection
        setSelectedProducts(
          selectedProducts.filter((p) => p.id !== product.id)
        );
      }
    } else {
      // Select the product with only the selected variant
      const newProduct = {
        ...product,
        variants: product.variants.map((v, i) => ({
          ...v,
          selected: i === variantIndex,
        })),
      };
      setSelectedProducts([...selectedProducts, newProduct]);
    }
  };

  // Determine if all variants of a product are selected
  const isProductFullySelected = (product) => {
    const selectedProduct = selectedProducts.find((p) => p.id === product.id);
    return (
      selectedProduct &&
      selectedProduct.variants.every((variant) => variant.selected)
    );
  };

  // Determine if some variants of a product are selected
  const isProductPartiallySelected = (product) => {
    const selectedProduct = selectedProducts.find((p) => p.id === product.id);
    return (
      selectedProduct &&
      selectedProduct.variants.some((variant) => variant.selected) &&
      !isProductFullySelected(product)
    );
  };

  return (
    <div className="modal">
      <h2>Select Products</h2>
      <input
        className="search-bar"
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div
        className="product-picker-list"
        onScroll={(e) => {
          if (
            e.target.scrollHeight - e.target.scrollTop ===
            e.target.clientHeight
          ) {
            setPage(page + 1);
          }
        }}
      >
        {products.map((product) => (
          <div className="picker-product-item" key={product.id}>
            <input
              type="checkbox"
              checked={isProductFullySelected(product)}
              indeterminate={isProductPartiallySelected(product)}
              onChange={() => handleProductSelect(product)}
            />
            <img src={product.image.src} alt={product.title} style={{height:"2px", width:"2px"}} />
            <span>{product.title}</span>
            <div className="product-variants">
              {product.variants.map((variant, i) => (
                <div className="variant-item" key={i}>
                  <input
                    type="checkbox"
                    checked={selectedProducts.some(
                      (p) => p.id === product.id && p.variants[i]?.selected
                    )}
                    onChange={() => handleVariantSelect(product, i)}
                  />
                  <span>
                    {variant.title} - ${variant.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button className="confirm-btn" onClick={() => onClose(selectedProducts)}>
        Confirm
      </button>
    </div>
  );
};

export default ProductPicker;
