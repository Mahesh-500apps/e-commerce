import React from "react";
import { Draggable } from "react-beautiful-dnd";
import StrictModeDroppable from "./StrictModeDroppable";

const ProductList = ({ products, onEdit, setProducts }) => {
  // Remove the entire product
  const removeProduct = (index) => {
    const updated = [...products];
    updated.splice(index, 1);
    setProducts(updated);
  };

  // Remove a specific variant
  const removeVariant = (productIndex, variantIndex) => {
    const updated = [...products];
    updated[productIndex].variants.splice(variantIndex, 1);
    if (updated[productIndex].variants.length === 0) {
      // Remove product if no variants left
      updated.splice(productIndex, 1);
    }
    setProducts(updated);
  };

  return (
    <StrictModeDroppable droppableId="productList">
      {(provided) => (
        <div
          className="product-list"
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {products.map((product, index) => (
            <Draggable
              key={product.id}
              draggableId={product.id.toString()}
              index={index}
            >
              {(provided) => (
                <div
                  className="product-item"
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <img
                    className="product-image"
                    src={product.image.src}
                    alt={product.title}
                  />
                  <div className="product-details">
                    <h2>{product.title || "New Product"}</h2>
                    <div className="product-variants">
                      {product.variants.map((variant, i) => (
                        <div className="variant" key={i}>
                          <span>{variant.title}</span> -{" "}
                          <span>${variant.price}</span>
                          <button
                            className="remove-btn variant-remove"
                            onClick={() => removeVariant(index, i)}
                          >
                            X
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="product-actions">
                      <button
                        className="edit-btn"
                        onClick={() => onEdit(index)}
                      >
                        Edit
                      </button>
                      <button
                        className="remove-btn"
                        onClick={() => removeProduct(index)}
                      >
                        Remove Product
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </StrictModeDroppable>
  );
};

export default ProductList;
