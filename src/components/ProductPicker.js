import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";

const ProductPicker = ({ onSelect, onClose, selectedProducts = [] }) => {
  const [state, setState] = useState({
    search: "",
    allProducts: [],
    filteredProducts: [],
    selectedVariants: {},
    loading: true, // Added loading state
  });

  useEffect(() => {
    fetch("https://stageapi.monkcommerce.app/task/products/search?page=1&limit=10", {
      headers: {
        "x-api-key": "72njgfa948d9aS7gs5",
        "Content-Type": "application/json",
      },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => {
        const products = Array.isArray(data) ? data : [];
        setState((prev) => ({
          ...prev,
          allProducts: products,
          filteredProducts: products,
          loading: false, // Set loading to false after fetching
        }));
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setState((prev) => ({ ...prev, loading: false })); // Hide loading on error
      });
  }, []);

  useEffect(() => {
    const selectedMap = {};
    selectedProducts.forEach((product) => {
      selectedMap[product.id] = product.variants || [];
    });
    setState((prev) => ({ ...prev, selectedVariants: selectedMap }));
  }, [selectedProducts]);

  useEffect(() => {
    const filtered = state.search.trim()
      ? state.allProducts.filter((product) =>
          product.title.toLowerCase().includes(state.search.toLowerCase())
        )
      : state.allProducts;

    setState((prev) => ({ ...prev, filteredProducts: filtered }));
  }, [state.search, state.allProducts]);

  const handleSearchChange = (e) => {
    setState((prev) => ({ ...prev, search: e.target.value }));
  };

  const toggleVariantSelection = (variant, productId) => {
    setState((prev) => {
      const variants = prev.selectedVariants[productId] || [];
      const updatedVariants = variants.some((v) => v.id === variant.id)
        ? variants.filter((v) => v.id !== variant.id)
        : [...variants, variant];

      return { ...prev, selectedVariants: { ...prev.selectedVariants, [productId]: updatedVariants } };
    });
  };

  const toggleProductSelection = (product) => {
    setState((prev) => {
      const allSelected = prev.selectedVariants[product.id]?.length === product.variants.length;
      return {
        ...prev,
        selectedVariants: { ...prev.selectedVariants, [product.id]: allSelected ? [] : product.variants },
      };
    });
  };

  const handleAddProducts = () => {
    const selectedProductsList = Object.entries(state.selectedVariants)
      .map(([productId, variants]) => {
        const product = state.allProducts.find((p) => p.id === parseInt(productId));
        return product ? { ...product, variants } : null;
      })
      .filter(Boolean);

    onSelect(selectedProductsList);
    onClose();
  };

  const selectedProductCount = Object.values(state.selectedVariants).filter((variants) => variants.length > 0).length;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded shadow-md max-w-[663px] md:w-[663px] max-h-[612px] h-[612px]">
        <div className="font-medium text-lg flex justify-between border-b items-center mb-4 pb-4">
          Select Products
          <button onClick={onClose} className="h-fit">x</button>
        </div>

        <div className="relative mb-2">
          <input
            type="text"
            placeholder="Search product"
            className="w-full p-2 border text-sm pl-10"
            value={state.search}
            onChange={handleSearchChange}
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>

        <div className="max-h-[430px] overflow-y-auto">
          {state.loading ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : (
            state.filteredProducts.map((product) => {
              const allSelected = state.selectedVariants[product.id]?.length === product.variants.length;
              const someSelected = state.selectedVariants[product.id]?.length > 0 && !allSelected;
              const isDisabled = selectedProducts.some((p) => p.id === product.id);

              return (
                <div key={product.id} className="px-2 pt-3 border-b ">
                  <label className="flex cursor-pointer items-center border-b pb-3">
                    <input
                      type="checkbox"
                      className="h-6 w-6 accent-green-600 cursor-pointer border-gray-300 rounded focus:ring-green-500"
                      checked={allSelected}
                      ref={(el) => el && (el.indeterminate = someSelected)}
                      disabled={isDisabled}
                      onChange={() => toggleProductSelection(product)}
                    />
                    <img
                      src={product.image?.src || "https://www.svgrepo.com/show/508699/landscape-placeholder.svg"}
                      alt={product.title}
                      className="w-9 h-9 mx-2 rounded inline-block"
                    />
                    <span className="capitalize">{product.title}</span>
                  </label>

                  {product.variants.length > 0 && (
                    <>
                      {product.variants.map((variant) => (
                        <label key={variant.id} className="flex cursor-pointer  items-center justify-between border-b last:border-none pt-3 pb-3 px-8 rounded">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              className="h-6 w-6 accent-green-600 border-gray-300 rounded focus:ring-green-500"
                              checked={state.selectedVariants[product.id]?.some((v) => v.id === variant.id)}
                              disabled={isDisabled}
                              onChange={() => toggleVariantSelection(variant, product.id)}
                            />
                            <span className="ml-1">{variant.title}</span>
                          </div>
                          <div className="flex items-center gap-8">
                          <p>{variant.inventory_quantity || "0"} available</p>
                          <p>${variant.price}</p>
                          </div>
                        </label>
                      ))}
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="flex justify-between items-center mt-2">
          <p className="text-[#00000099] py-2">
            {selectedProductCount} {selectedProductCount > 1 ? "products" : "product"} selected
          </p>
          <div className="flex gap-4">
            <button onClick={onClose} className="text-[#00000099] border-[#00000066] border py-2 px-6 rounded">
              Cancel
            </button>
            <button onClick={handleAddProducts} className="bg-[#008060] text-white p-2 px-4 rounded">
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPicker;
