import React from "react";
import { RiDraggable } from "react-icons/ri";

export default function List({
  index,
  titleClass,
  title,
  isEditingVariantDiscount,
  discountButton,
  removeVariantButton,
  inputClass,
}) {
  return (
    <div className="w-full flex items-center justify-between cursor-move gap-2 ">
      <RiDraggable />
      {index ? index : ""}
      {index ? "." : ""}
      <span className={`${titleClass} border py-1 px-2 shadow-lg `}>
        {title}
      </span>
      {isEditingVariantDiscount ? (
        <>
          <input
            type="number"
            placeholder="0"
            className={`${inputClass} border p-1 w-12 ml-2  shadow-lg`}
          />
          <select className={`${inputClass} border p-1 shadow-lg`}>
            <option value="%">%</option>
            <option value="flat">Flat Off</option>
          </select>
        </>
      ) : (
        <button
          onClick={discountButton}
          className="bg-green-500 text-white px-2 h-8 rounded ml-2"
        >
          Add Discount
        </button>
      )}
      <button onClick={removeVariantButton} className="text-[#00000066]">
        x
      </button>
    </div>
  );
}
