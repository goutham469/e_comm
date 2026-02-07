import React, { useEffect, useState } from 'react'
import AdminProduct from './AdminProduct'
import SectionIndicatorCard from '../components/SectionIndicator';
import { tools } from '../utils/aws_upload';
import { Trash2 } from 'lucide-react';
import { API } from '../utils/API';
import { toast } from 'react-toastify';
import ProductGlance from './ProductGlance';
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';


function Products() {
    const [data, setData] = useState({});
    const [activeProduct, setActiveProduct] = useState(null);
    const [ filters, setFilters ] = useState({})
  
    async function getData()
    {
      const res = await API.GENERAL.products(filters);
      res.success ? setData(res.data) : toast.error(res.error);
    }

    const onFilterChange = (new_filter) => {
      setFilters(new_filter);
    }
  
    useEffect(() => { getData(); }, [filters]);

  return (
    <div>
        <SectionIndicatorCard text={'ADMIN/ Products'} />
        
        <div className='p-3'>
          {/* Header */}
          <div className="flex justify-between items-center"> 
            <button
              onClick={() => setActiveProduct({})}
              className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm"
            >
              + Add Product
            </button>
          </div>

          <SearchBar />
          <Filters />
          {/* List */}
          <ProductGlance
            data={data}
            onEdit={setActiveProduct}
            onRefresh={getData}
            onFilterChange={onFilterChange}
          />

          {/* Form */}
          {activeProduct !== null && (
            <ProductForm
              data={activeProduct}
              onClose={() => setActiveProduct(null)}
              onSuccess={() => {
                setActiveProduct(null);
                getData();
              }}
            />
          )}
        </div>

    </div>
  ) 
}

export default Products;


function ProductForm({ data = {}, onClose, onSuccess })
{
  const isCreation = !data._id;

  const [form, setForm] = useState({
    name: data.name || "",
    slug: data.slug || "",
    categoryId: data.categoryId || "",
    subCategoryId: data.subCategoryId || "",
    price: data.price || "",
    discount: data.discount || "",
    stock: data.stock || "",
    description: data.description || "",
    shortDescription: data.shortDescription || "",
    thumbnail: data.thumbnail || "",
    images: data.images || [],
    videoUrl: data.videoUrl || ""
  });

  const isValid =
    form.name &&
    form.price &&
    form.stock &&
    form.thumbnail &&
    form.categoryId &&
    form.subCategoryId;

  async function save(e)
  {
    e.preventDefault();

    const payload = {
      ...form,
      price: Number(form.price),
      discount: Number(form.discount),
      stock: Number(form.stock)
    };

    const res = isCreation
      ? await API.ADMIN.PRODUCT.create_product(payload)
      : await API.ADMIN.PRODUCT.edit_product(data._id, payload);

    res.success ? toast.success("Saved") : toast.error(res.error);
    res.success && onSuccess();
  }

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <form className="bg-white rounded-xl w-full max-w-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold">
            {isCreation ? "Create Product" : "Edit Product"}
          </h3>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto flex-1">
           {/* Basic Info */}
        <section className="space-y-3">
          <input
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="Product name"
            className="w-full p-2 border rounded-lg"
          />

          <input
            value={form.slug}
            onChange={e => setForm({ ...form, slug: e.target.value })}
            placeholder="Slug (optional)"
            className="w-full p-2 border rounded-lg"
          />

          <CategoryAndSubCategorySelection form={form} setForm={setForm} />
        </section>

        {/* Pricing */}
        <section className="grid grid-cols-3 gap-3">
          <input
            type="number"
            value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
            placeholder="Price"
            className="p-2 border rounded-lg"
          />
          <input
            type="number"
            value={form.discount}
            onChange={e => setForm({ ...form, discount: e.target.value })}
            placeholder="Discount %"
            className="p-2 border rounded-lg"
          />
          <input
            type="number"
            value={form.stock}
            onChange={e => setForm({ ...form, stock: e.target.value })}
            placeholder="Stock"
            className="p-2 border rounded-lg"
          />
        </section>

        {/* Descriptions */}
        <section className="space-y-2">
          <textarea
            value={form.shortDescription}
            onChange={e => setForm({ ...form, shortDescription: e.target.value })}
            placeholder="Short description"
            className="w-full p-2 border rounded-lg"
          />
          <textarea
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Detailed description (HTML allowed)"
            className="w-full p-2 border rounded-lg min-h-[120px]"
          />
        </section>

        {/* Media */}
        <section className="space-y-4">

          {/* Thumbnail */}
          <UploadField
            label="Thumbnail"
            preview={form.thumbnail}
            onUpload={url => setForm(prev => ({ ...prev, thumbnail: url }))}
          />

          {/* Images */}
          <Images form={form} setForm={setForm} />

          {/* Video */}
          <UploadField
            label="Product Video"
            preview={form.videoUrl}
            onUpload={url => setForm(prev => ({ ...prev, videoUrl: url }))}
          />

        </section>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>

          <button
            onClick={save}
            disabled={!isValid}
            className={`px-4 py-2 rounded-lg text-white
              ${isValid ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}
            `}
          >
            Save Product
          </button>
        </div>

      </form>
    </div>
  );
}


function CategoryAndSubCategorySelection({ form, setForm })
{
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    (async () => {
      const c = await API.GENERAL.categories();
      const s = await API.GENERAL.subCategories();
      if (c.success) setCategories(c.data.categories);
      if (s.success) setSubCategories(s.data.subCategories);
    })();
  }, []);

  return (
    <div className="grid grid-cols-2 gap-3">
      <select
        value={form.categoryId}
        onChange={e =>
          setForm(prev => ({ ...prev, categoryId: e.target.value }))
        }
        className="p-2 border rounded-lg"
      >
        <option value="">Select Category</option>
        {categories.map(c => (
          <option key={c._id} value={c._id}>{c.name}</option>
        ))}
      </select>

      <select
        value={form.subCategoryId}
        onChange={e =>
          setForm(prev => ({ ...prev, subCategoryId: e.target.value }))
        }
        className="p-2 border rounded-lg"
      >
        <option value="">Select Sub-Category</option>
        {subCategories.map(s => (
          <option key={s._id} value={s._id}>{s.name}</option>
        ))}
      </select>
    </div>
  );
}

function UploadField({ label, preview, onUpload })
{
  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-600">{label}</p>

      {preview && (
        <img src={preview} className="w-24 h-24 rounded-lg border" />
      )}

      <label className="inline-block px-3 py-2 border rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 text-sm">
        Upload
        <input
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={async e => {
            const file = e.target.files[0];
            if (!file) return;

            const res = await tools.AWS_upload_file(file);
            res.success ? onUpload(res.data.file_url) : toast.error(res.error);
          }}
        />
      </label>
    </div>
  );
}


function Images({ form, setForm })
{
  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-600">Gallery Images</p>

      {form.images.length === 0 && (
        <p className="text-xs text-gray-500">No images added</p>
      )}

      <div className="grid grid-cols-5 gap-2">
        {form.images.map(img => (
          <div key={img} className="relative">
            <img src={img} className="w-16 h-16 rounded-md border" />
            <Trash2
              className="absolute top-1 right-1 text-red-500 cursor-pointer"
              onClick={() =>
                setForm(prev => ({
                  ...prev,
                  images: prev.images.filter(i => i !== img)
                }))
              }
            />
          </div>
        ))}
      </div>

      <UploadField
        label="Add Image"
        onUpload={url =>
          setForm(prev => ({ ...prev, images: [...prev.images, url] }))
        }
      />
    </div>
  );
}