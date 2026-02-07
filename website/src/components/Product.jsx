import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Heart, Share2, ChevronLeft, ChevronRight, Shield, Truck, RotateCcw, Check, AlertCircle, ArrowLeft, ZoomIn } from 'lucide-react';
import AddToCartButton from './AddToCartButton';
import { API } from '../utils/API';
import { toast } from 'react-toastify';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  // Image zoom states
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  async function fetchProductById() {
    try {
      setLoading(true);
      const response = await API.GENERAL.product_details(id);
      if (response.success) {
        setProduct(response.data.product);
        document.title = `${response.data.product.name} | Your Store`;
      } else {
        toast.error(response.error);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      fetchProductById();
    }
  }, [id]);

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x, y });
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: product.shortDescription,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        toast.error('Failed to share');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 rounded-xl"></div>
              <div className="grid grid-cols-5 gap-2">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-12 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product || !product._id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const allImages = product.images?.length > 0 ? [product.thumbnail, ...product.images] : [product.thumbnail];

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column - Images & Video */}
          <div className="lg:col-span-7 space-y-6">
            {/* Main Image with Zoom */}
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <div 
                className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden group cursor-crosshair"
                ref={imageRef}
                onMouseEnter={() => setShowZoom(true)}
                onMouseLeave={() => setShowZoom(false)}
                onMouseMove={handleMouseMove}
              >
                <img
                  src={allImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-300"
                  style={showZoom ? { transform: 'scale(1.5)', transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` } : {}}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/600?text=No+Image';
                  }}
                />
                
                {product.discount > 0 && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    {product.discount}% OFF
                  </div>
                )}

                {showZoom && (
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm">
                    <ZoomIn size={16} />
                    Hover to zoom
                  </div>
                )}

                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage((prev) => (prev - 1 + allImages.length) % allImages.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={() => setSelectedImage((prev) => (prev + 1) % allImages.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {allImages.length > 1 && (
                <div className="grid grid-cols-6 gap-3 mt-4">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === idx 
                          ? 'border-green-600 ring-2 ring-green-200' 
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`View ${idx + 1}`}
                        className="w-full h-full object-contain bg-gray-50"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Video Section */}
            {product.videoUrl && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Video</h3>
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <iframe
                    src={product.videoUrl}
                    className="w-full h-full"
                    allowFullScreen
                    title="Product Video"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Product Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4 space-y-6">
              {/* Product Name & Rating */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
                  {product.name}
                </h1>
                <p className="text-gray-600 mb-4">{product.shortDescription}</p>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-lg">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-lg">
                      {product.ratingAverage > 0 ? product.ratingAverage.toFixed(1) : 'New'}
                    </span>
                  </div>
                  <span className="text-gray-600 text-sm">
                    {product.reviewCount} {product.reviewCount === 1 ? 'review' : 'reviews'}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="border-y border-gray-200 py-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-bold text-gray-900">
                    {API.TOOLS.formatPrice(product.sellingPrice)}
                  </span>
                  {product.discount > 0 && (
                    <>
                      <span className="text-xl text-gray-400 line-through">
                        {API.TOOLS.formatPrice(product.price)}
                      </span>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                        Save {API.TOOLS.formatPrice(product.price - product.sellingPrice)}
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-500">Inclusive of all taxes</p>
              </div>

              {/* Stock & Availability */}
              <div className="flex items-center gap-3">
                {product.stock > 0 ? (
                  <div className="flex items-center gap-2 text-green-700">
                    <Check className="w-5 h-5" />
                    <span className="font-semibold">In Stock ({product.stock} available)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-semibold">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Quantity & Actions */}
              <div className="space-y-4">
                {/* <div className="flex items-center gap-4">
                  <label className="font-semibold text-gray-700">Quantity:</label>
                  <div className="flex items-center border-2 border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-gray-100 transition font-semibold"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-6 py-2 font-semibold min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-4 py-2 hover:bg-gray-100 transition font-semibold"
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                </div> */}

                <div className="flex gap-3">
                  <div className="flex-1">
                    <AddToCartButton product={product} quantity={quantity} />
                  </div>
                  <button 
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`p-3 border-2 rounded-lg transition ${
                      isWishlisted 
                        ? 'border-red-500 bg-red-50 text-red-500' 
                        : 'border-gray-300 hover:border-red-300 hover:bg-red-50'
                    }`}
                  >
                    <Heart size={24} className={isWishlisted ? 'fill-red-500' : ''} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-3 border-2 border-gray-300 rounded-lg hover:border-green-300 hover:bg-green-50 transition"
                  >
                    <Share2 size={24} />
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <Truck className="w-6 h-6 text-green-600 mx-auto mb-1" />
                  <p className="text-xs font-semibold text-gray-900">Free Delivery</p>
                  <p className="text-xs text-gray-600">Above ₹499</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <RotateCcw className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                  <p className="text-xs font-semibold text-gray-900">Easy Returns</p>
                  <p className="text-xs text-gray-600">7 Days</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <Shield className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                  <p className="text-xs font-semibold text-gray-900">Secure</p>
                  <p className="text-xs text-gray-600">100% Safe</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Sections */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Description */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Details</h2>
            <div 
              className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>

          {/* Product Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Specifications</h2>
            <div className="space-y-3">
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="font-semibold text-gray-700">SKU</span>
                <span className="text-gray-600 font-mono text-sm">{product._id?.slice(-8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="font-semibold text-gray-700">Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  product.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {product.status}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="font-semibold text-gray-700">Availability</span>
                <span className={product.stock > 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              <div className="flex justify-between py-3">
                <span className="font-semibold text-gray-700">Listed</span>
                <span className="text-gray-600 text-sm">{API.TOOLS.formatDate(product.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;