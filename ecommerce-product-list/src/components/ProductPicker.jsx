import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductPicker = ({ onClose, updateProducts }) => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `/task/products/search?search=${searchTerm}&page=${page}&limit=1`,
          {
            headers: {
              "x-api-key": "72njgfa948d9aS7gs5", // Your API key here
            },
          }
        );

        if (Array.isArray(response.data)) {
          setProducts((prev) => [...prev, ...response.data]);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [page, searchTerm]);

  const handleScroll = (e) => {
    if (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight) {
      setPage((prev) => prev + 1);
    }
  };

  const handleSelect = (product) => {
    const isSelected = selectedProducts.some(
      (id) =>
        id === product.id ||
        product.variants.some((variant) => variant.id === id)
    );

    if (isSelected) {
      setSelectedProducts((prev) => {
        const newSelection = prev.filter((id) => id !== product.id);
        product.variants.forEach((variant) => {
          if (newSelection.includes(variant.id)) {
            newSelection.splice(newSelection.indexOf(variant.id), 1);
          }
        });
        return newSelection;
      });
    } else {
      setSelectedProducts((prev) => {
        const newSelection = [...prev, product.id];
        product.variants.forEach((variant) => {
          newSelection.push(variant.id);
        });
        return newSelection;
      });
    }
  };

  const handleVariantSelect = (variantId) => {
    setSelectedProducts((prev) => {
      if (prev.includes(variantId)) {
        return prev.filter((id) => id !== variantId); // Deselect
      } else {
        return [...prev, variantId]; // Select
      }
    });
  };

  const handleSave = () => {
    const selectedProductDetails = products.filter(
      (product) =>
        selectedProducts.includes(product.id) ||
        product.variants.some((variant) =>
          selectedProducts.includes(variant.id)
        )
    );

    // Prepare final products to be sent back
    const finalProducts = selectedProductDetails.map((product) => {
      return {
        id: product.id,
        title: product.title,
        variants: product.variants.filter((variant) =>
          selectedProducts.includes(variant.id)
        ),
      };
    });

    // Send only the relevant data
    updateProducts(finalProducts);
    onClose();
  };

  const isProductSelected = (productId) => selectedProducts.includes(productId);
  const isVariantSelected = (variantId) => selectedProducts.includes(variantId);

  return (
    <div
      style={{
        overflowY: "auto",
        maxHeight: "300px",
        border: "1px solid #ccc",
        padding: "10px",
      }}
      onScroll={handleScroll}
    >
      <input
        type="text"
        placeholder="Search products"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {products.map((product) => (
        <div key={product.id} style={{ marginBottom: "15px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="checkbox"
              checked={
                isProductSelected(product.id) ||
                product.variants.some((variant) =>
                  isVariantSelected(variant.id)
                )
              }
              onChange={() => handleSelect(product)}
            />
            <span
              style={{
                fontWeight: isProductSelected(product.id) ? "bold" : "normal",
              }}
            >
              {isProductSelected(product.id) &&
              !product.variants.every((variant) =>
                isVariantSelected(variant.id)
              )
                ? "-"
                : ""}{" "}
              {product.title}
            </span>
            <img
              src={product.image.src}
              alt={product.title}
              style={{ width: "50px", marginLeft: "10px" }}
            />
          </div>
          <div style={{ paddingLeft: "20px", marginTop: "5px" }}>
            {product.variants.map((variant) => (
              <div
                key={variant.id}
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  checked={isVariantSelected(variant.id)}
                  onChange={() => handleVariantSelect(variant.id)}
                />
                <span
                  style={{
                    textDecoration: isVariantSelected(variant.id)
                      ? "underline"
                      : "none",
                  }}
                >
                  {variant.title} - ${variant.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
      <button onClick={handleSave}>Save Selected</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default ProductPicker;
