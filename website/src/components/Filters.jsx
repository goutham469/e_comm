import React, { useEffect, useState } from "react";
import { API } from "../utils/API";
import { useSearchParams } from "react-router-dom";

function Filters()
{
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "0"
  );
  const [selectedSubCategory, setSelectedSubCategory] = useState(
    searchParams.get("subCategory") || "0"
  );

  async function getData()
  {
    try
    {
      const [catRes, subCatRes] = await Promise.all([
        API.GENERAL.categories(),
        API.GENERAL.subCategories(),
      ]);

      if (catRes.success)
      {
        setCategories(catRes.data.categories);
      }

      if (subCatRes.success)
      {
        setSubCategories(catRes.data ? subCatRes.data.subCategories : []);
      }
    }
    catch (err)
    {
      console.log(err);
    }
  }

  useEffect(() =>
  {
    getData();
  }, []);

  /* 🔑 Sync CATEGORY to URL */
  useEffect(() =>
  {
    const params = new URLSearchParams(searchParams);

    if (selectedCategory !== "0")
      params.set("category", selectedCategory);
    else
      params.delete("category");

    // reset subCategory when category changes
    params.delete("subCategory");

    setSearchParams(params);
  }, [selectedCategory]);

  /* 🔑 Sync SUB-CATEGORY to URL */
  useEffect(() =>
  {
    const params = new URLSearchParams(searchParams);

    if (selectedSubCategory !== "0")
      params.set("subCategory", selectedSubCategory);
    else
      params.delete("subCategory");

    setSearchParams(params);
  }, [selectedSubCategory]);

  const filteredSubCategories =
    selectedCategory === "0"
      ? []
      : subCategories.filter(
          (sub) => sub.categoryId === selectedCategory
        );

  return (
    <div className="space-y-4">
      <p className="font-semibold">Filters</p>

      {/* CATEGORY */}
      <select
        className="w-60 p-2 border rounded-lg bg-white m-2"
        value={selectedCategory}
        onChange={(e) =>
        {
          setSelectedCategory(e.target.value);
          setSelectedSubCategory("0");
        }}
      >
        <option value="0">Select Category</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* SUB CATEGORY */}
      <select
        className="w-60 p-2 border rounded-lg bg-white m-2"
        value={selectedSubCategory}
        onChange={(e) => setSelectedSubCategory(e.target.value)}
        disabled={selectedCategory === "0"}
      >
        <option value="0">Select Sub Category</option>
        {filteredSubCategories.map((sub) => (
          <option key={sub._id} value={sub._id}>
            {sub.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Filters;
