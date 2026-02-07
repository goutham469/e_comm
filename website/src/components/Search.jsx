import React, {useEffect, useState} from 'react'
import ProductGlance from '../Admin/ProductGlance'
import Filters from './Filters'
import { API } from '../utils/API';
import { toast } from 'react-toastify';
import { useSearchParams } from "react-router-dom";

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState({});
  const [ filters, setFilters ] = useState({})

  async function getData()
  {
    const cur_filters = {
      search:searchParams.get("search") || "",
      page:searchParams.get("page") || 0,
      category:searchParams.get("category") || "",
      subCategory:searchParams.get("subCategory") || ""
    }
    const res = await API.GENERAL.products(cur_filters);
    res.success ? setData(res.data) : toast.error(res.error);
  }

  useEffect(() => { getData(); }, [filters]);

  return (
    <div>
      <Filters />
      <ProductGlance 
        data={data}
      />
    </div>
  )
}

export default Search