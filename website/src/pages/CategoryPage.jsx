import React, { useEffect, useState } from 'react'
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { API } from '../utils/API';

function CategoryPage() {
    const [ data, setData ] = useState({});

    async function getData( category_id )
    {
        try{
            const response = await API.GENERAL.categoryPageData( category_id );
            if(response.success){
                setData( response.data )
            }else{
                alert(response.error)
            }
        }catch(err){
            console.error(err)
        }
    }

    useEffect(()=>{
        const search_params = new URLSearchParams(window.location.search);
        const category_id = search_params.get("category_id")

        getData( category_id );
    },[])

  return (
    <div>
        <Header/>
        <div>
            <p>{ data?.categoryName }</p>
            <div className='flex justify-between'>
                {/*Sidebar */}
                <div className='flex'>
                    {
                        data?.subCategories?.map( ( subCategory, idx ) => <SubCategory data={subCategory} /> )
                    }
                </div>
                
                {/*Catalog */}
                <div>
                    {/*Summary */}
                    <div>
                        <p>{data?.products?.productsCount} products found ...</p>
                        <p> Showing 1 of {data?.products?.totalPages} pages</p>
                    </div>
                    {/*Products */}
                    <div>
                        {
                            data?.products?.products?.map( (product, idx) => <ProductCard data={product} /> )
                        }
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CategoryPage;

function SubCategory({ data })
{
    return <div className='bg-cyan-50 m-2 p-3 '>
                <p>{data?.name}</p>
                <img
                    src={data?.icon}
                />
            </div>
}