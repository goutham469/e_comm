import { Search } from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import React, { useState } from "react";

function SearchBar()
{
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    const [value, setValue] = useState(
        searchParams.get("searchText") || ""
    );

    function handleSubmit(e)
    {
        e.preventDefault();

        const params = new URLSearchParams(searchParams); // ✅ clone

        if (value)
            params.set("searchText", value);
        else
            params.delete("searchText");

        setSearchParams(params);
    }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full bg-stone-300 m-2 rounded-3xl"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search products"
        className="w-full px-4 py-2"
        onFocus={() =>
        {
          if (location.pathname !== "/dashboard/products")
          {
            navigate("/search");
          }
        }}
      />

      <button type="submit" className="px-4 bg-yellow-400 rounded-3xl">
        <Search size={18} />
      </button>
    </form>
  );
}

export default SearchBar;
