import React from "react";

const ProductItem = ({
  product,
  index,
  removeProduct,
  handleEdit,
  innerRef,
  draggableProps,
  dragHandleProps,
}) => {
  return (
    <div
      ref={innerRef}
      {...draggableProps}
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: "8px",
        padding: "8px",
        border: "1px solid #ccc",
        borderRadius: "4px",
      }}
    >
      <div {...dragHandleProps} style={{ cursor: "grab", marginRight: "8px" }}>
        &#8597; {/* Drag handle icon */}
      </div>
      <div style={{ flexGrow: 1 }}>
        <h3>{product.name || "Unnamed Product"}</h3>
        <img src={product.image} alt={product.name} width="100" />
        {product.variants.map((variant) => (
          <div key={variant.id}>
            <span>
              {variant.size} - {variant.color}
            </span>
          </div>
        ))}
      </div>
      <button onClick={() => handleEdit(index)}>Edit</button>
      <button onClick={() => removeProduct(product.id)}>x</button>
    </div>
  );
};

export default ProductItem;
