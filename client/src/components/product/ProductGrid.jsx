import ProductCard from './ProductCard';
import LoadingSpinner from '../ui/LoadingSpinner';

function ProductGrid({ products, loading }) {
  if (loading) return <LoadingSpinner />;

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-5xl mb-4">🌸</p>
        <h3 className="text-lg font-medium text-gray-700">No products found</h3>
        <p className="text-gray-500 mt-1">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}

export default ProductGrid;
