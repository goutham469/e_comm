import React, { useEffect, useState } from 'react'
import { API } from '../utils/API';
import {useNavigate, useSearchParams} from 'react-router-dom'

function CategoriesShowBar({ categories = [] })
{
  return (
    <div>
      <b className="block mb-3">Categories</b>

      <div className="
        grid
        grid-cols-4
        sm:grid-cols-5
        md:grid-cols-6
        lg:grid-cols-8
        xl:grid-cols-10
        gap-4
      ">
        {categories.map(category => (
          <Category key={category._id} data={category} />
        ))}
      </div>
    </div>
  );
}

function Category({ data })
{
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <button
      type="button"
      className="
        w-full
        p-3
        rounded-xl
        bg-cyan-50
        hover:bg-cyan-100
        transition
        flex
        flex-col
        items-center
        gap-2
      "
      onClick={() =>
      {
        const params = new URLSearchParams(searchParams);
        params.set("category", data._id);
        params.delete("subCategory");
        params.delete("page");
        setSearchParams(params);
        navigate("/search");
      }}
    >
      <img
        src={data.icon}
        alt={data.name}
        className="w-12 h-12 object-contain"
      />

      <p className="text-xs font-medium text-center truncate w-full">
        {data.name}
      </p>
    </button>
  );
}


export default CategoriesShowBar;

