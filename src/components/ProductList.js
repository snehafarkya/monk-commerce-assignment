import React, { useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import List from "./List";

const ProductList = ({ products, setProducts }) => {
  const [openProductIds, setOpenProductIds] = useState(new Set());
  const [editingDiscounts, setEditingDiscounts] = useState({});

  const toggleProductVariants = (productId) => {
    setOpenProductIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const toggleEditingDiscount = (productId, variantId = null) => {
    setEditingDiscounts((prev) => ({
      ...prev,
      [`${productId}-${variantId || "product"}`]:
        !prev[`${productId}-${variantId || "product"}`],
    }));
  };

  const handleRemoveProduct = (productId) => {
    setProducts(products.filter((p) => p.id !== productId));
  };

  const handleRemoveVariant = (productId, variantId) => {
    setProducts(
      products.map((p) =>
        p.id === productId
          ? { ...p, variants: p.variants.filter((v) => v.id !== variantId) }
          : p
      )
    );
  };

  // Drag and Drop Handlers
  const handleDragStart = (e, type, itemId, parentId = null) => {
    e.dataTransfer.setData("type", type);
    e.dataTransfer.setData("itemId", itemId);
    e.dataTransfer.setData("parentId", parentId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropTargetIndex, dropTargetParentId = null) => {
    e.preventDefault();

    const type = e.dataTransfer.getData("type");
    const draggedItemId = parseInt(e.dataTransfer.getData("itemId"), 10);
    const draggedParentId = e.dataTransfer.getData("parentId")
      ? parseInt(e.dataTransfer.getData("parentId"), 10)
      : null;

    if (type === "product") {
      // Reorder products
      const draggedIndex = products.findIndex((p) => p.id === draggedItemId);
      if (draggedIndex === -1) return;

      const updatedProducts = [...products];
      const [movedItem] = updatedProducts.splice(draggedIndex, 1);
      updatedProducts.splice(dropTargetIndex, 0, movedItem);

      setProducts(updatedProducts);
    } else if (type === "variants") {
      // Ensure the variant belongs to the correct parent product
      if (
        draggedParentId === null ||
        dropTargetParentId === null ||
        draggedParentId !== dropTargetParentId
      )
        return;

      const parentIndex = products.findIndex((p) => p.id === draggedParentId);
      if (parentIndex === -1) return;

      const parentProduct = { ...products[parentIndex] };
      const draggedVariantIndex = parentProduct.variants.findIndex(
        (v) => v.id === draggedItemId
      );
      if (draggedVariantIndex === -1) return;
      
    }
  };

  return (
    <div>
      {products.map((product, index) => (
        <div
          key={product.id}
          draggable
          onDragStart={(e) => handleDragStart(e, "product", product.id)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, index)}
        >
          <ProductItem
            index={index + 1}
            product={product}
            openProductIds={openProductIds}
            toggleProductVariants={toggleProductVariants}
            toggleEditingDiscount={toggleEditingDiscount}
            editingDiscounts={editingDiscounts}
            handleRemoveProduct={handleRemoveProduct}
            handleRemoveVariant={handleRemoveVariant}
            handleDragStart={handleDragStart}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
          />
        </div>
      ))}
    </div>
  );
};

const ProductItem = ({
  product,
  index,
  openProductIds,
  toggleProductVariants,
  toggleEditingDiscount,
  editingDiscounts,
  handleRemoveProduct,
  handleRemoveVariant,
  handleDragStart,
  handleDragOver,
  handleDrop,
}) => {
  const isEditingDiscount = editingDiscounts[`${product.id}-product`];

  return (
    <div className="p-2 mb-2 ">
      <div className="flex cursor-move gap-4 text-sm justify-between items-center">
        <List
          titleClass={"rounded-sm w-[400px]"}
          title={product.title}
          isEditingVariantDiscount={isEditingDiscount}
          discountButton={() => toggleEditingDiscount(product.id)}
          removeVariantButton={() =>
            handleRemoveProduct(product.id, product.id)
          }
        />
      </div>

      <button
        className="flex w-full justify-end text-sm underline text-[#006EFF] underline-offset-2 items-center gap-1"
        onClick={() => toggleProductVariants(product.id)}
      >
        {openProductIds.has(product.id) ? "Hide Variants" : "Show Variants"}
        {openProductIds.has(product.id) ? (
          <MdKeyboardArrowUp />
        ) : (
          <MdKeyboardArrowDown />
        )}
      </button>

      {openProductIds.has(product.id) && product.variants?.length > 0 && (
        <div className="ml-12 mt-4">
          {product.variants.map((variant, vIndex) => {
            const isEditingVariantDiscount =
              editingDiscounts[`${product.id}-${variant.id}`];

            return (
              <div
                key={variant.id}
                className="text-sm w-full flex justify-between items-center gap-2 mt-2"
                draggable
                onDragStart={(e) =>
                  handleDragStart(e, "variants", variant.id, product.id)
                }
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, vIndex, product.id)} // Use product.id here, not variant.id
              >
                <List
                  titleClass={"rounded-[30px]  w-[350px]"}
                  title={variant.title}
                  isEditingVariantDiscount={isEditingVariantDiscount}
                  discountButton={() =>
                    toggleEditingDiscount(product.id, variant.id)
                  }
                  removeVariantButton={() =>
                    handleRemoveVariant(product.id, variant.id)
                  }
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductList;
