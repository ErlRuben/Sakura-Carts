import { useState, useEffect } from 'react';
import { CATEGORIES } from '../../utils/constants';
import { createProduct, updateProduct } from '../../api/products';

function ProductForm({ editProduct, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: CATEGORIES[0],
    stock: '',
    featured: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editProduct) {
      setForm({
        name: editProduct.name,
        description: editProduct.description,
        price: String(editProduct.price),
        category: editProduct.category,
        stock: String(editProduct.stock),
        featured: editProduct.featured,
      });
      setImagePreview(editProduct.image);
    }
  }, [editProduct]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('category', form.category);
      formData.append('stock', form.stock);
      formData.append('featured', form.featured);
      if (imageFile) formData.append('image', imageFile);

      if (editProduct) {
        await updateProduct(editProduct._id, formData);
      } else {
        if (!imageFile) {
          setError('Please select an image');
          setSaving(false);
          return;
        }
        await createProduct(formData);
      }

      onSave();
      if (!editProduct) {
        setForm({
          name: '',
          description: '',
          price: '',
          category: CATEGORIES[0],
          stock: '',
          featured: false,
        });
        setImageFile(null);
        setImagePreview('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-sakura-100 rounded-xl p-6">
      <h3 className="font-bold text-lg text-dark mb-4">
        {editProduct ? 'Edit Product' : 'Add New Product'}
      </h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="input-field"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price (₱)</label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
          <input
            type="number"
            required
            min="0"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            className="input-field"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            required
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                       file:rounded-lg file:border-0 file:text-sm file:font-medium
                       file:bg-sakura-50 file:text-sakura-600 hover:file:bg-sakura-100"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2 w-24 h-24 object-cover rounded-lg border border-sakura-100"
            />
          )}
        </div>
        <div className="flex items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="w-4 h-4 text-sakura-400 border-gray-300 rounded focus:ring-sakura-300"
            />
            <span className="text-sm font-medium text-gray-700">Featured Product</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving...' : editProduct ? 'Update Product' : 'Add Product'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default ProductForm;
