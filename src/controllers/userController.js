const logger = require('../logger');
const axios = require('axios');

const usersDb = [
  { id: 'cust-123', name: 'Arjun Mehta', email: 'arjun@example.com', tier: 'premium' },
  { id: 'cust-456', name: 'Priya Nair', email: 'priya@example.com', tier: 'standard' },
];

const getUser = async (req, res) => {
  const user = usersDb.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Enrich with analytics data
  try {
    const analyticsUrl = process.env.ANALYTICS_ENDPOINT;
    const enriched = await axios.get(`${analyticsUrl}/users/${user.id}`, {
      timeout: 2000,
    });
    return res.status(200).json({ ...user, analytics: enriched.data });
  } catch (err) {
    // analytics service unavailable — return base user
    return res.status(200).json(user);
  }
};

const createUser = (req, res) => {
  const { name, email, tier } = req.body;
  const newUser = {
    id: `cust-${Math.floor(Math.random() * 9000) + 1000}`,
    name,
    email,
    tier: tier || 'standard',
  };
  usersDb.push(newUser);
  logger.info(`User created: ${newUser.id}`);
  return res.status(201).json(newUser);
};

module.exports = { getUser, createUser };
