import { Link } from 'react-router-dom';
import { CATEGORY_ICONS } from '../../utils/constants';

function CategoryCard({ category }) {
  return (
    <Link
      to={`/shop?category=${encodeURIComponent(category)}`}
      className="group bg-white border border-sakura-100 rounded-xl p-6 text-center
                 hover:shadow-lg hover:border-sakura-300 transition-all duration-300"
    >
      <div className="text-4xl mb-3">{CATEGORY_ICONS[category] || '📦'}</div>
      <h3 className="font-medium text-dark group-hover:text-sakura-400 transition-colors">
        {category}
      </h3>
    </Link>
  );
}

export default CategoryCard;
