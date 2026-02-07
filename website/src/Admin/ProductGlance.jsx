import { useEffect, useState } from 'react';
import { Package, Eye, ChevronLeft, ChevronRight, } from 'lucide-react';
import { API } from '../utils/API';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

function ProductGlance({ onEdit = null })
{
  const [data, setData] = useState({});
  const [filters, setFilters] = useState({});

  const user = useSelector(state => state.user);
  const [searchParams, setSearchParams] = useSearchParams();

  const products = data?.products || [];
  const totalPages = data?.totalPages || 1;
  const productsCount = data?.productsCount || 0;

  // admin needed 
  const [currentPage, setCurrentPage] = useState(data?.page || 0);
  const [limit, setLimit] = useState(data?.limit || 20);

  function buildFilters(params)
  {
    const f = {};

    if (params.get("searchText"))
      f.searchText = params.get("searchText");

    if (params.get("category"))
      f.category = params.get("category");

    if (params.get("subCategory"))
      f.subCategory = params.get("subCategory");

    f.page = Number(params.get("page") || 1 );
    f.limit = Number(params.get("limit") || 20);

    return f;
  }

  useEffect(() =>
  {
    setFilters(buildFilters(searchParams));
  }, [searchParams]);

  async function getData()
  {
    const res = await API.GENERAL.products(filters);
    res.success ? setData(res.data) : toast.error(res.error);
  }

  useEffect(() =>
  {
    getData();
  }, [filters]);

  const handlePageChange = (newPage) =>
  {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    setSearchParams(params);
  };


  async function deleteProduct( product_id ){
    try{
      const response = await API.ADMIN.PRODUCT.delete_product(product_id);
      if(response.success){
        toast.success("Product deleted");
      }else{
        toast.error("Delete Failed.");
      }
    }catch(err){
      toast.error(err.messaage)
    }
  }


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      {
        user && user.role === 'ADMIN' &&
        <div className="mb-6">
          {/* Meta Information */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{productsCount}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Eye className="text-green-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Page</p>
                  <p className="text-2xl font-bold text-gray-900">{currentPage + 1} / {totalPages}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Package className="text-purple-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Showing</p>
                  <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Package className="text-orange-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Per Page</p>
                  <p className="text-2xl font-bold text-gray-900">{limit}</p>
                </div>
              </div>
            </div>
          </div>
          

          {/* Filters */}
          {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div> */}
        </div>
      }

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 mb-6">
        {products.map((product) =>  <ProductCard product={product} deleteProduct={deleteProduct} onEdit={onEdit} />)}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {currentPage * limit + 1} to {Math.min((currentPage + 1) * limit, productsCount)} of {productsCount} products
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
              </button>
              
              {/* Page Numbers */}
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, idx) => {
                  // Show first page, last page, current page, and pages around current
                  if (
                    idx === 0 ||
                    idx === totalPages - 1 ||
                    (idx >= currentPage - 1 && idx <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={idx}
                        onClick={() => handlePageChange(idx)}
                        className={`px-3 py-1 rounded-lg ${
                          currentPage === idx
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  } else if (idx === currentPage - 2 || idx === currentPage + 2) {
                    return <span key={idx} className="px-2">...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {products.length === 0 && (
        <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  );
}

// Example Usage
export default ProductGlance; 