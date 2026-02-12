import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatCurrency';

function CartSummary() {
  const { cartTotal, cartCount } = useCart();

  return (
    <div className="bg-white border border-sakura-100 rounded-xl p-6">
      <h3 className="font-serif font-bold text-lg text-dark mb-4">
        Order Summary
      </h3>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-gray-600">
          <span>Items ({cartCount})</span>
          <span>{formatCurrency(cartTotal)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span>{cartTotal >= 50 ? 'Free' : formatCurrency(5.99)}</span>
        </div>
        <hr className="border-sakura-100" />
        <div className="flex justify-between font-bold text-dark text-lg">
          <span>Total</span>
          <span>
            {formatCurrency(cartTotal >= 50 ? cartTotal : cartTotal + 5.99)}
          </span>
        </div>
      </div>
      {cartTotal < 50 && (
        <p className="text-xs text-sakura-400 mb-4">
          Add {formatCurrency(50 - cartTotal)} more for free shipping!
        </p>
      )}
      <Link
        to="/checkout"
        className="btn-primary block text-center w-full"
      >
        Proceed to Checkout
      </Link>
      <Link
        to="/shop"
        className="block text-center text-sm text-sakura-400 hover:text-sakura-500 mt-3"
      >
        Continue Shopping
      </Link>
    </div>
  );
}

export default CartSummary;
