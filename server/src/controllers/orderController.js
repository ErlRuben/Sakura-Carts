const Order = require('../models/Order');
const Product = require('../models/Product');
const Message = require('../models/Message');

// POST /api/orders
const createOrder = async (req, res, next) => {
  try {
    const { items, shippingInfo } = req.body;

    if (!items || items.length === 0) {
      res.status(400);
      throw new Error('No order items');
    }

    // Look up each product, validate stock, calculate total
    const orderItems = [];
    let totalAmount = 0;
    const outOfStock = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        res.status(404);
        throw new Error(`Product not found: ${item.productId}`);
      }

      if (product.stock < item.quantity) {
        outOfStock.push({
          name: product.name,
          available: product.stock,
          requested: item.quantity,
        });
        continue;
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image,
      });

      totalAmount += product.price * item.quantity;
    }

    if (outOfStock.length > 0) {
      res.status(400);
      throw new Error(
        `Insufficient stock: ${outOfStock.map((i) => `${i.name} (${i.available} available, ${i.requested} requested)`).join(', ')}`
      );
    }

    // Decrement stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    let order;
    try {
      order = await Order.create({
        user: req.user._id,
        items: orderItems,
        shippingInfo,
        totalAmount,
      });
    } catch (saveError) {
      // Restore stock that was already decremented
      await Promise.all(
        orderItems.map((item) =>
          Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } })
        )
      );
      throw saveError;
    }

    // Create order confirmation message for the user's chat (non-critical)
    const itemsSummary = orderItems
      .map((i) => `${i.name} x${i.quantity} - $${(i.price * i.quantity).toFixed(2)}`)
      .join('\n');

    try {
      await Message.create({
        type: 'order',
        name: shippingInfo.fullName,
        email: req.user.email,
        subject: `Order #${order._id.toString().slice(-8)}`,
        message: `${itemsSummary}\n\nTotal: $${totalAmount.toFixed(2)}\n\nShipping to: ${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`,
      });
    } catch (msgError) {
      console.error('Failed to create order confirmation message:', msgError);
    }

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

// GET /api/orders
const getOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20, archived, month, year } = req.query;
    const filter = {};
    if (status) filter.status = status;

    // Filter by archived status (default: show non-archived)
    filter.archived = archived === 'true';

    // Filter by month and year
    if (month && year) {
      const m = parseInt(month, 10);
      const y = parseInt(year, 10);
      const start = new Date(y, m - 1, 1);
      const end = new Date(y, m, 1);
      filter.createdAt = { $gte: start, $lt: end };
    } else if (year) {
      const y = parseInt(year, 10);
      const start = new Date(y, 0, 1);
      const end = new Date(y + 1, 0, 1);
      filter.createdAt = { $gte: start, $lt: end };
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Order.countDocuments(filter),
    ]);

    res.json({
      orders,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/my-orders
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/:id
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }
    if (req.user.role !== 'admin' && !order.user.equals(req.user._id)) {
      res.status(403);
      throw new Error('Not authorized to view this order');
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
};

// PATCH /api/orders/:id/status
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    const oldStatus = order.status;
    order.status = status;
    const updated = await order.save();

    // Add status update reply to the order's chat message
    const orderTag = `Order #${order._id.toString().slice(-8)}`;
    const statusMessages = {
      processing: `Your ${orderTag} is now being processed.`,
      shipped: `Your ${orderTag} has been shipped! It's on the way.`,
      delivered: `Your ${orderTag} has been delivered. Enjoy your items!`,
      cancelled: `Your ${orderTag} has been cancelled.`,
      pending: `Your ${orderTag} status has been set back to pending.`,
    };

    if (oldStatus !== status) {
      const orderMessage = await Message.findOne({
        type: 'order',
        subject: orderTag,
      });

      if (orderMessage) {
        orderMessage.replies.push({
          text: statusMessages[status] || `Status updated to: ${status}`,
          adminName: 'Sakura Carts',
        });
        await orderMessage.save();
      }
    }

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// PATCH /api/orders/:id/archive
const archiveOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }
    order.archived = !order.archived;
    const updated = await order.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// PUT /api/orders/:id
const updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }
    const { shippingInfo } = req.body;
    if (shippingInfo) {
      order.shippingInfo = { ...order.shippingInfo.toObject(), ...shippingInfo };
    }
    const updated = await order.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/orders/:id
const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }
    res.json({ message: 'Order deleted' });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/export
const exportOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ archived: true }).sort({ createdAt: -1 });
    const data = JSON.stringify(orders, null, 2);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=archived-orders-${new Date().toISOString().slice(0, 10)}.json`);
    res.send(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  archiveOrder,
  updateOrder,
  deleteOrder,
  exportOrders,
};
