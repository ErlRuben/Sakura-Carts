import { CATEGORIES } from '../../utils/constants';

function FilterSidebar({ selectedCategory, onCategoryChange, sort, onSortChange }) {
  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-serif font-bold text-dark mb-3">Categories</h3>
        <div className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <button
            onClick={() => onCategoryChange('')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-md text-sm transition-colors md:w-full md:text-left ${
              !selectedCategory
                ? 'bg-sakura-200 text-sakura-600 font-medium'
                : 'text-gray-600 hover:bg-sakura-50'
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-md text-sm transition-colors md:w-full md:text-left ${
                selectedCategory === cat
                  ? 'bg-sakura-200 text-sakura-600 font-medium'
                  : 'text-gray-600 hover:bg-sakura-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <h3 className="font-serif font-bold text-dark mb-3">Sort By</h3>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="input-field text-sm"
        >
          <option value="newest">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name">Name: A to Z</option>
        </select>
      </div>
    </div>
  );
}

export default FilterSidebar;
