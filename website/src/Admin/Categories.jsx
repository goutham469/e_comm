import React, { useEffect, useState } from 'react'
import SectionIndicatorCard from '../components/SectionIndicator'
import { API } from '../utils/API';
import { toast } from 'react-toastify';
import { tools } from '../utils/aws_upload';

function Categories()
{ 
  const [data, setData] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  async function getData()
  {
    const res = await API.GENERAL.categories();
    res.success ? setData(res.data.categories) : toast.error(res.error);
  }

  useEffect(() => { getData(); }, []);

  return (
    <div>

      <SectionIndicatorCard text="Admin → Categories" />

      <div className='p-3'>
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">Categories</h2>
          <button
            onClick={() => setActiveCategory({})}
            className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm"
          >
            + Add Category
          </button>
        </div>

        {/* List */}
        <CategoriesList
          data={data}
          onEdit={setActiveCategory}
          onRefresh={getData}
        />

        {/* Form */}
        {activeCategory !== null && (
          <CategoryForm
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


export default Categories;


function CategoriesList({ data = [], onEdit, onRefresh })
{
  async function deleteCategory(id)
  {
    const res = await API.ADMIN.CATEGORY.delete_category(id);
    res.success ? toast.success("Deleted") : toast.error(res.error);
    onRefresh();
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {data.map(category => (
        <div
          key={category._id}
          className="flex items-center gap-4 p-4 border rounded-xl bg-white"
        >
          <img
            src={category.icon}
            className="w-12 h-12 rounded-lg object-cover"
          />

          <div className="flex-1">
            <p className="font-medium">{category.name}</p>
            <p className="text-xs text-gray-500">
              Created {API.TOOLS.timestamp_formatter(category.createdAt)}
            </p>
          </div>

          <button
            onClick={() => onEdit(category)}
            className="text-blue-600 text-sm"
          >
            Edit
          </button>

          <button
            onClick={() => deleteCategory(category._id)}
            className="text-red-500 text-sm"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}



function CategoryForm({ data = {}, onClose, onSuccess })
{
  const isCreation = !data._id;

  const [form, setForm] = useState({
    name: data.name || "",
    icon: data.icon || ""
  });

  async function save(e)
  {
    e.preventDefault();

    const res = isCreation
      ? await API.ADMIN.CATEGORY.create_category(form)
      : await API.ADMIN.CATEGORY.edit_category(data._id, form);

    res.success ? toast.success("Saved") : toast.error(res.error);
    res.success && onSuccess();
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <form className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
        <h3 className="text-lg font-medium">
          {isCreation ? "Create Category" : "Edit Category"}
        </h3>

        {form.icon && (
          <img src={form.icon} className="w-16 h-16 rounded-lg" />
        )}

        <input
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          placeholder="Category name"
          className="w-full p-2 border rounded-lg"
        />

        <input
          type="file"
          className='bg-stone-600 rounded-md p-1'
          onChange={async e =>
          {
            const file = e.target.files[0];
            if (!file) return;

            const res = await tools.AWS_upload_file(file);
            if (res.success)
            {
              setForm(prev => ({ ...prev, icon: res.data.file_url }));
            }
            else toast.error(res.error);
          }}
        />

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500"
          >
            Cancel
          </button>

          <button
            onClick={save}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
