import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <p className="text-6xl mb-6">🌸</p>
      <h1 className="text-4xl font-bold text-sakura-400 mb-4">
        Page Not Found
      </h1>
      <p className="text-gray-600 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn-primary">
        Go Home
      </Link>
    </div>
  );
}

export default NotFoundPage;
