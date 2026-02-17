import { Link } from 'react-router-dom';
import HeroSection from '../components/ui/HeroSection';
import FeaturedProducts from '../components/product/FeaturedProducts';
import CategoryCard from '../components/ui/CategoryCard';
import { CATEGORIES } from '../utils/constants';

function HomePage() {
  return (
    <div>
      <HeroSection />
      <FeaturedProducts />

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-sakura-400 text-center mb-10">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((category) => (
            <CategoryCard key={category} category={category} />
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-sakura-400 to-sakura-500 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Free Shipping on Orders Over $50
          </h2>
          <p className="text-sakura-100 mb-6">
            Discover the beauty of Japan with our carefully selected products.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-white text-sakura-500 px-8 py-3 rounded-lg font-medium
                       hover:bg-sakura-50 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
