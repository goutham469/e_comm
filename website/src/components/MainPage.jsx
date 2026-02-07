import React, { useEffect, useState } from 'react'
import { API } from '../utils/API';
import Banner from './Banner';
import CategoriesShowBar from './CategoriesShowBar';
import CategoryWiseProducts from './CategoryWiseProducts';
import { DEFAULT_DATA } from '../utils/default';

function MainPage() {
  const [ data, setData ] = useState(DEFAULT_DATA.website_data);
  const [ loading, setLoading ] = useState(true);

  async function getData()
  {
    try{
      const response = await API.website_data();
      setData(response.data)
      setLoading(false);
    }catch(err){
      console.log(err);
    }finally{
      setLoading(false);
    }
  }

  useEffect(()=>{
    setLoading(true);
    getData();
  },[])

  return (
    <div>
        <Banner data={ data?.websiteData } />
        <div className='m-8'>
          <CategoriesShowBar categories={data?.categories} />
          <CategoryWiseProducts />
        </div>
    </div>
  )
}

export default MainPage