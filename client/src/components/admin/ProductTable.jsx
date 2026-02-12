import { formatCurrency } from '../../utils/formatCurrency';

function ProductTable({ products, onEdit, onDelete }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No products yet. Add your first product above!
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-sakura-100">
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Image</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Name</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Category</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Price</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Stock</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id} className="border-b border-gray-100 hover:bg-sakura-50/50">
              <td className="py-3 px-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded-lg"
                />
              </td>
              <td className="py-3 px-4">
                <span className="font-medium text-dark">{product.name}</span>
                {product.featured && (
                  <span className="ml-2 text-xs bg-sakura-200 text-sakura-600 px-2 py-0.5 rounded-full">
                    Featured
                  </span>
                )}
              </td>
              <td className="py-3 px-4 text-sm text-gray-600">{product.category}</td>
              <td className="py-3 px-4 font-medium">{formatCurrency(product.price)}</td>
              <td className="py-3 px-4">
                <span className={product.stock === 0 ? 'text-red-500 font-medium' : 'text-gray-600'}>
                  {product.stock}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="text-sm text-sakura-400 hover:text-sakura-500 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(product._id)}
                    className="text-sm text-red-500 hover:text-red-700 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;
