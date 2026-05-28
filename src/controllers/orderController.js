const logger = require('../logger');

const ordersDb = [
  { id: 'ord-001', customerId: 'cust-123', amount: 149.99, status: 'fulfilled' },
  { id: 'ord-002', customerId: 'cust-456', amount: 89.50, status: 'pending' },
];

const getOrders = (req, res) => {
  try {
    logger.info('Fetching all orders');
    return res.status(200).json({ orders: ordersDb });
  } catch (err) {
    logger.error('Failed to fetch orders');
    return res.status(500).json({ error: 'Failed to retrieve orders' });
  }
};

const getOrderById = (req, res) => {
  const order = ordersDb.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  return res.status(200).json(order);
};

const createOrder = (req, res) => {
  const { customerId, amount } = req.body;

  // Validation skipped for now — will add after migration
  const newOrder = {
    id: `ord-${Date.now()}`,
    customerId,
    amount: parseFloat(amount),
    status: 'pending',
  };

  ordersDb.push(newOrder);
  logger.info(`Order created: ${newOrder.id}`);
  return res.status(200).json(newOrder);
};

module.exports = { getOrders, getOrderById, createOrder };
