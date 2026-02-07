import React, { useEffect, useState } from 'react'
import { API } from '../utils/API';
import { toast } from 'react-toastify';
import { tools } from '../utils/aws_upload';
import SectionIndicatorCard from '../components/SectionIndicator';

function Settings() {
  const [data, setData] = useState({});

  async function getData()
  {
    const response = await API.website_data();
    if(response.success){
      setData(response.data.websiteData);

      console.log( response.data.websiteData );
    }else{
      toast.error( response.error )
    }
  }

  useEffect(()=>{
    getData();
  },[])

  return (
    <div>
      <SectionIndicatorCard text={'ADMIN/Settings '} />
      
      <div className='p-3'>
        <FlashTitle 
          prev_href={data?.flash_title?.href}
          prev_text={data?.flash_title?.text}
        />

        <BannerSettings
          banner_desktop={data?.banner_desktop}
          view={'desktop'}
        />

        <BannerSettings
          banner_desktop={data?.banner_mobile}
          view={'mobile'}
        />

      </div>
    </div>
  )
}

export default Settings;

function FlashTitle({ prev_text, prev_href })
{
  const [form, setForm] = useState({
    text: "",
    href: ""
  });

  /* Sync props → state */
  useEffect(() =>
  {
    setForm({
      text: prev_text || "",
      href: prev_href || ""
    });
  }, [prev_text, prev_href]);

  async function updateTitle(e)
  {
    e.preventDefault();

    try
    {
      const response = await API.ADMIN.update_website_flash_title(form);

      if (response.success)
      {
        toast.success("Title updated");
      }
      else
      {
        toast.error(response.error);
      }
    }
    catch (err)
    {
      console.error(err);
      toast.error("Something went wrong");
    }
  }

  return (
    <form
      onSubmit={updateTitle}
      className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-6 space-y-6 m-2"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-800">
          Flash Text
        </h2>
      </div>


      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          value={form.text}
          onChange={e => setForm({ ...form, text: e.target.value })}
          placeholder="enter some text here..."
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-indigo-500
                     focus:border-indigo-500 transition"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Reference
        </label>
        <input
          type="text"
          value={form.href}
          onChange={e => setForm({ ...form, href: e.target.value })}
          placeholder="enter some link here"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-indigo-500
                     focus:border-indigo-500 transition"
        />
      </div>

      <button
        type="submit"
        className="mt-2 bg-indigo-600 text-white p-2 rounded-lg
                   font-semibold text-sm hover:bg-indigo-700
                   active:scale-95 transition"
      >
        Update
      </button>
    </form>
  );
}

function BannerSettings({ banner_desktop, view })
{
  const [images, setImages] = useState([]);
  const [visible, setVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [rawUrl, setRawUrl] = useState("");

  useEffect(() =>
  {
    if (banner_desktop?.length)
    {
      setImages(banner_desktop);
    }
  }, [banner_desktop]);

  async function saveChanges()
  {
    const Service =
      view === "desktop"
        ? API.ADMIN["edit-banner-images-desktop"]
        : API.ADMIN["edit-banner-images-mobile"];

    const res = await Service(images);
    res.success ? toast.success("Saved") : toast.error(res.error);
  }

  function deleteImage(idx)
  {
    setImages(prev => prev.filter((_, i) => i !== idx));
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-6 space-y-6 m-2">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-800">
          Banner Images ({view})
        </h2>

        <button
          onClick={saveChanges}
          className="bg-blue-600 text-white px-5 py-2 rounded-full
                     text-sm font-medium hover:bg-blue-700"
        >
          Save
        </button>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {images.map((image, idx) => (
          <div
            key={idx}
            className="group border rounded-xl p-3 hover:shadow transition"
          >
            <img
              src={image.url}
              className="w-full h-40 object-cover rounded-lg"
              alt="banner"
            />

            {/* Edit Section */}
            <div className="mt-3 space-y-2">
              <input
                value={image.href}
                placeholder="Redirect link (optional)"
                onChange={e =>
                  setImages(prev =>
                    prev.map((img, i) =>
                      i === idx ? { ...img, href: e.target.value } : img
                    )
                  )
                }
                className="w-full text-sm px-3 py-2 border rounded-md
                           focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={() => deleteImage(idx)}
                className="text-sm text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Image */}
      {!visible ? (
        <button
          onClick={() => setVisible(true)}
          className="text-blue-600 text-sm font-medium hover:underline"
        >
          + Add banner image
        </button>
      ) : (
        <div className="border rounded-xl p-4 space-y-4 bg-gray-50">

          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={async e =>
            {
              const file = e.target.files[0];
              if (!file) return;

              setUploading(true);
              const res = await tools.AWS_upload_file(file);
              setUploading(false);

              res.success
                ? setImages(prev => [...prev, { url: res.data.file_url, href: "" }])
                : toast.error(res.error);
            }}
          />

          <div className="flex gap-2">
            <input
              value={rawUrl}
              onChange={e => setRawUrl(e.target.value)}
              placeholder="Or paste image URL"
              className="flex-1 px-3 py-2 text-sm border rounded-md"
            />
            <button
              onClick={() =>
              {
                if (!rawUrl) return;
                setImages(prev => [...prev, { url: rawUrl, href: "" }]);
                setRawUrl("");
              }}
              className="bg-blue-600 text-white px-4 rounded-md"
            >
              Add
            </button>
          </div>

          {uploading && (
            <p className="text-sm text-gray-500">Uploading…</p>
          )}
        </div>
      )}
    </div>
  );
}


