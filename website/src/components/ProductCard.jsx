import React from 'react';
import AddToCartButton from './AddToCartButton';
import { Edit, Eye, EyeOff, Trash2, Star } from 'lucide-react';
import { API } from '../utils/API';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function ProductCard({ product, onEdit = null, deleteProduct = null }) {
  const user = useSelector(state => state.user);
  const navigate = useNavigate();

  function handleProductClick(e)
  {
    e.preventDefault();
    navigate(`/product/${product._id}`);
  }

  return (
    <div 
      key={product._id} 
      className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
      onClick={handleProductClick}
    >
      {/* Product Image */}
      <div className="relative h-40 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <img
          src={product.thumbnail}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
          }}
        />
        
        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow">
            {product.discount}% OFF
          </div>
        )}
        
        {/* Visibility Badge - Admin Only */}
        {user.role === 'ADMIN' && (
          <div className="absolute top-2 left-2">
            {product.visibility === 'PUBLIC' || product.visibility?.[0] ? (
              <div className="bg-green-500 text-white p-1.5 rounded-full shadow">
                <Eye size={14} />
              </div>
            ) : (
              <div className="bg-gray-600 text-white p-1.5 rounded-full shadow">
                <EyeOff size={14} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-3">
        {/* Product Name */}
        <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2 leading-tight group-hover:text-green-600 transition-colors">
          {product.name}
        </h3>
        <p className='text-sm max-h-15 overflow-hidden'>{product.shortDescription}</p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-xs text-gray-900">
              {product.ratingAverage.toFixed(1)}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price Section */}
        <div className="flex items-baseline gap-1.5 mb-2">
          <span className="text-lg font-bold text-gray-900">
            {API.TOOLS.formatPrice(product.sellingPrice)}
          </span>
          {product.discount > 0 && (
            <span className="text-xs text-gray-400 line-through">
              {API.TOOLS.formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Stock & Status - Admin Only */}
        {user.role === 'ADMIN' && (
          <div className="flex items-center gap-1.5 mb-2">
            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
              product.stock > 10 ? 'bg-green-100 text-green-700' :
              product.stock > 0 ? 'bg-amber-100 text-amber-700' :
              'bg-red-100 text-red-700'
            }`}>
              {product.stock}
            </span>
            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
              product.status === 'ACTIVE' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700'
            }`}>
              {product.status}
            </span>
          </div>
        )}

        {/* Add to Cart Button */}
        <div className="mb-2">
          <AddToCartButton product={product} />
        </div>

        {/* Admin Actions */}
        {user && user.role === 'ADMIN' && (
          <div className='flex gap-1.5'>
            <button
              onClick={(e) => { 
                e.preventDefault();
                e.stopPropagation();
                onEdit?.(product);
              }}
              className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-95 transition-all text-xs font-medium shadow-sm cursor-pointer"
            >
              <Edit size={14} />
              Edit
            </button>

            <button
              onClick={(e) => { 
                e.preventDefault();
                e.stopPropagation();
                deleteProduct(product._id);
              }}
              className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-red-600 text-white rounded-xl hover:bg-red-700 active:scale-95 transition-all text-xs font-medium shadow-sm cursor-pointer"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductCard;