import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatCurrency';

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const outOfStock = product.stock === 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (outOfStock) return;
    addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock,
    });
  };

  return (
    <Link
      to={`/product/${product._id}`}
      className="group bg-white border border-sakura-100 rounded-xl overflow-hidden
                 hover:shadow-lg hover:border-sakura-200 transition-all duration-300"
    >
      <div className="relative aspect-square overflow-hidden bg-washi-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {outOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-800 px-4 py-2 rounded-lg font-medium text-sm">
              Out of Stock
            </span>
          </div>
        )}
        {product.featured && !outOfStock && (
          <span className="absolute top-2 left-2 bg-sakura-400 text-white text-xs font-bold px-2 py-1 rounded-md">
            Featured
          </span>
        )}
      </div>

      <div className="p-4">
        <span className="text-xs font-medium text-sakura-500 bg-sakura-50 px-2 py-0.5 rounded-full">
          {product.category}
        </span>
        <h3 className="mt-2 font-medium text-dark group-hover:text-sakura-400 transition-colors line-clamp-1">
          {product.name}
        </h3>
        <div className="mt-2">
          <span className="text-lg font-bold text-sakura-600">
            {formatCurrency(product.price)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            className={`mt-2 w-full text-sm py-1.5 rounded-lg font-medium transition-colors ${
              outOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-sakura-400 text-white hover:bg-sakura-500'
            }`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
