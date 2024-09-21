import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./ProductList.css";

const ProductList = ({ products, setProducts, openPicker }) => {
  console.log(products, "products");

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedProducts = Array.from(products);
    const [movedProduct] = reorderedProducts.splice(result.source.index, 1);
    reorderedProducts.splice(result.destination.index, 0, movedProduct);
    setProducts(reorderedProducts);
  };

  const removeProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="products">
        {(provided) => (
          <ul
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="product-list"
          >
            {products.map((product, index) => (
              <Draggable
                key={product.id}
                draggableId={String(product.id)}
                index={index}
              >
                {(provided) => (
                  <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="product-item"
                  >
                    <div>
                      <strong>{product.title || "Unnamed Product"}</strong>
                      {product.variants && product.variants.length > 0 && (
                        <ul>
                          {product.variants.map((variant) => (
                            <li key={variant.id}>
                              <span
                                style={{
                                  textDecoration: variant.selected
                                    ? "underline"
                                    : "none",
                                }}
                              >
                                {variant.title} - ${variant.price}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <button onClick={() => openPicker(index)}>Edit</button>
                    {products.length > 1 && (
                      <button onClick={() => removeProduct(index)}>X</button>
                    )}
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ProductList;
