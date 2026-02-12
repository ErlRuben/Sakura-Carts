import { Link } from 'react-router-dom';

function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      <img 
        src="/banner.jpg" 
        alt="Japanese Background" 
        className="absolute inset-0 w-full h-full object-cover -z-0"
      />

      <div className="absolute inset-0 bg-gradient-to-br from-sakura-100/90 via-sakura-50/80 to-washi-50/70 -z-10"></div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-6 h-6 bg-sakura-200 rounded-full opacity-40 animate-pulse"></div>
        <div className="absolute top-32 right-20 w-4 h-4 bg-sakura-300 rounded-full opacity-30 animate-pulse delay-300"></div>
        <div className="absolute bottom-20 left-1/3 w-5 h-5 bg-sakura-200 rounded-full opacity-35 animate-pulse delay-700"></div>
        <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-sakura-300 rounded-full opacity-25 animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-dark mb-6">
            Discover Authentic{' '}
            <span className="text-sakura-400">Japanese</span> Treasures
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            From traditional crafts to modern favorites, explore our curated
            collection of unique Japanese items delivered straight to your door.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop" className="btn-primary text-lg px-8 py-3 bg-sakura-600 text-white rounded-md">
              Shop Now
            </Link>
            <Link to="/shop?category=Traditional+Crafts" className="btn-secondary text-lg px-8 py-3 border border-sakura-600 text-sakura-600 rounded-md">
              Explore Crafts
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
