import React, { useEffect, useState } from 'react'
import SectionIndicatorCard from '../components/SectionIndicator';
import { API } from '../utils/API';
import { tools } from '../utils/aws_upload';
import { toast } from 'react-toastify';

function SubCategories()
{
    const [data, setData] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
  
    async function getData()
    {
      const res = await API.GENERAL.subCategories();
      res.success ? setData(res.data.subCategories) : toast.error(res.error);
    }
  
    useEffect(() => { getData(); }, []);
  
    return (
      <div>
  
        <SectionIndicatorCard text="Admin / Sub-Categories" />
  
        <div className='p-3'>
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Sub-Categories</h2>
            <button
              onClick={() => setActiveCategory({})}
              className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm cursor-pointer"
            >
              + Add Sub-Category
            </button>
          </div>
  
          {/* List */}
          <SubCategoriesList
            data={data}
            onEdit={setActiveCategory}
            onRefresh={getData}
          />
  
          {/* Form */}
          {activeCategory !== null && (
            <SubCategoryForm
              data={activeCategory}
              onClose={() => setActiveCategory(null)}
              onSuccess={() => {
                setActiveCategory(null);
                getData();
              }}
            />
          )}
        </div>
      </div>
    );
}

export default SubCategories;


function SubCategoriesList({ data = [], onEdit, onRefresh })
{
  const [subCategories, setSubCategories] = useState(data);

  useEffect(()=>{
    setSubCategories(data)
  },[data])
  
  async function deleteSubCategory(id)
  {
    const res = await API.ADMIN.SUB_CATEGORY.delete_sub_category(id);
    if(res.success)
    {
      setSubCategories( subCategories.filter( (value, index) => value._id !== id ) );
      toast.success("Deleted");
      onRefresh();
    }else{
      toast.error(res.error)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {subCategories.map(subCategory => (
        <div
          key={subCategory._id}
          className="flex items-center gap-4 p-4 border rounded-xl bg-white"
        >
          <img
            src={subCategory.icon}
            className="w-12 h-12 rounded-lg object-cover"
          />

          <div className="flex-1">
            <p className="font-medium">{subCategory.name}</p>
            <p className="text-xs text-gray-500">
              Created {API.TOOLS.timestamp_formatter(subCategory.createdAt)}
            </p>
          </div>

          <button
            onClick={() => onEdit(subCategory)}
            className="text-blue-600 text-sm cursor-pointer"
          >
            Edit
          </button>

          <button
            onClick={() => deleteSubCategory(subCategory._id)}
            className="text-red-500 text-sm cursor-pointer"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}



function SubCategoryForm({ data = {}, onClose, onSuccess })
{
  const isCreation = !data._id;

  const [form, setForm] = useState({
    name: data.name || "",
    icon: data.icon || "",
    categoryId: data.categoryId || ""
  });

  async function save(e)
  {
    e.preventDefault();

    const res = isCreation
      ? await API.ADMIN.SUB_CATEGORY.create_sub_category(form)
      : await API.ADMIN.SUB_CATEGORY.edit_sub_category(data._id, form);

    res.success ? toast.success("Saved") : toast.error(res.error);
    res.success && onSuccess();
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <form className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {isCreation ? "Create Sub-Category" : "Edit Sub-Category"}
        </h3>

        {form.icon && (
            <div className="flex items-center gap-3">
              <img src={form.icon} className="w-12 h-12 rounded-lg border" />
              <p className="text-xs text-gray-500">Current icon</p>
            </div>
          )}


        <input
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          placeholder="Sub-Category name"
          className="w-full p-2 border rounded-lg"
        />

        <label className="inline-flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer text-sm bg-gray-50 hover:bg-gray-100">
          Upload Icon
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async e => {
              const file = e.target.files[0];
              if (!file) return;

              const res = await tools.AWS_upload_file(file);
              if (res.success) {
                setForm(prev => ({ ...prev, icon: res.data.file_url }));
              } else toast.error(res.error);
            }}
          />
        </label>
        <br/>

        <div className="space-y-1">
          <label className="text-sm text-gray-600">
            Parent Category <span className="text-red-500">*</span>
          </label>
          <CategoryInput
            selectedId={form.categoryId}
            handleCategoryChange={(id) =>
            {
              console.log(id);
              setForm(prev => ({ ...prev, categoryId: id }))
            }
            }
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={save}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}


function CategoryInput({ handleCategoryChange, selectedId })
{
  const [categories, setCategories] = useState([]);

  async function getCategories()
  {
    const response = await API.GENERAL.categories();
    if (response.success)
    {
      setCategories(response.data.categories);
    }
  }

  useEffect(() =>
  {
    getCategories();
  }, []);

  if (categories.length === 0)
  {
    return <p>Please create at least one category to create sub-category.</p>;
  }

  const options = [
    { _id: 0, name: "Not Selected" },
    ...categories,
  ];

  return (
    <select
      className="w-full p-2 border rounded-lg bg-white"
      value={selectedId}
      onChange={(e) => handleCategoryChange(e.target.value)}
    >
      {options.map((cat) => (
        <option key={cat._id} value={cat._id}>
          {cat.name}
        </option>
      ))}
    </select>
  );
}