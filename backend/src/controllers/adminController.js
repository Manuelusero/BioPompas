import Order from '../models/Order.js';

export const getStatistics = async (req, res) => {
  try {
    // Estadísticas de ventas
    const totalSales = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);

    // Productos más vendidos
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.product', totalSold: { $sum: '$items.quantity' } } },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
      { $unwind: '$product' },
      { $project: { productName: '$product.name', totalSold: 1 } },
    ]);

    res.json({ totalSales, topProducts });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener estadísticas' });
  }
};
