import React, { useState } from "react";
import ProductList from "./components/ProductList";
import ProductPicker from "./components/ProductPicker";
import AddProductButton from "./components/AddProductButton";
import monk from "./assets/monkLogo.svg";

const App = () => {
  const [products, setProducts] = useState([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  return (
    <div className="container mx-auto">
      <div className="flex items-center p-4 gap-4 border-b w-full">
        <img src={monk} alt="Logo" />
        <h1 className="font-semibold text-[#7E8185]">
          Monk Upsell & Cross-sell
        </h1>
      </div>

      <div className="grid grid-cols-1 place-items-center w-full my-16">
        <h2 className="font-semibold  mb-4 text-[#202223]">Add Products</h2>

        <div className="grid grid-cols-1 gap-6">
          <div className="flex items-start min-w-[350px] gap-4">
          <div className="flex flex-col gap-2 ">
            <span className="ml-8 mb-2">Product</span>
            <input
              type="text"
              placeholder="Select Product"
              onClick={() => setIsPickerOpen(true)}
              className="border px-2 py-1 max-w-[400px] md:w-[400px] min-w-[200px] ml-8 text-sm"
            />
            </div>
            <p className=" mb-2">Discount</p>
          </div>
          <ProductList products={products} setProducts={setProducts} />
        </div>
        <AddProductButton />
      </div>

      {isPickerOpen && (
        <ProductPicker
          onSelect={(newProducts) => {
            setProducts((prevProducts) => {
              const existingProductIds = new Set(prevProducts.map((p) => p.id));
              const uniqueNewProducts = newProducts.filter(
                (p) => !existingProductIds.has(p.id)
              );
              return [...prevProducts, ...uniqueNewProducts];
            });
          }}
          onClose={() => setIsPickerOpen(false)}
          selectedProducts={products || []}
        />
      )}
    </div>
  );
};

export default App;
