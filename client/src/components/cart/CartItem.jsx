import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatCurrency';

function CartItem({ item }) {
  const { removeFromCart, updateQuantity } = useCart();

  return (
    <div className="bg-white border border-sakura-100 rounded-xl p-4">
      <div className="flex items-center gap-4">
        <img
          src={item.image}
          alt={item.name}
          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg bg-washi-100 flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-dark truncate">{item.name}</h3>
          <p className="text-sakura-400 font-bold">{formatCurrency(item.price)}</p>
        </div>
        <button
          onClick={() => removeFromCart(item.productId)}
          className="text-sm text-red-500 hover:text-red-700 transition-colors flex-shrink-0 hidden sm:block"
        >
          Remove
        </button>
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center
                       hover:bg-sakura-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            -
          </button>
          <span className="w-8 text-center font-medium">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
            disabled={item.quantity >= item.stock}
            className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center
                       hover:bg-sakura-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            +
          </button>
        </div>
        <div className="flex items-center gap-4">
          <p className="font-bold text-dark">
            {formatCurrency(item.price * item.quantity)}
          </p>
          <button
            onClick={() => removeFromCart(item.productId)}
            className="text-sm text-red-500 hover:text-red-700 transition-colors sm:hidden"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
