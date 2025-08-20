import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import paypal from '@paypal/checkout-server-sdk';

// Configuración de PayPal
const environment = new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_SECRET);
const client = new paypal.core.PayPalHttpClient(environment);

export const checkout = async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;

  try {
    // Obtener el carrito del usuario
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'El carrito está vacío' });
    }

    // Crear la orden en la base de datos
    const order = new Order({
      user: req.user.id,
      items: cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.price,
      })),
      totalPrice: cart.totalPrice,
      shippingAddress,
      paymentMethod,
      status: 'Pending', // Inicializamos el estado de la orden como pendiente
    });

    await order.save();

    // Crear el pago en PayPal si el método de pago es PayPal
    if (paymentMethod === 'PayPal') {
      const request = new paypal.orders.OrdersCreateRequest();
      request.prefer('return=representation');
      request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: cart.totalPrice.toString(),
          },
        }],
        application_context: {
          return_url: `${process.env.CLIENT_URL}/success?orderId=${order._id}`,
          cancel_url: `${process.env.CLIENT_URL}/cancel`,
        },
      });

      try {
        const payPalOrder = await client.execute(request);

        // Guardar el PayPal payment ID en la base de datos
        order.paypalPaymentId = payPalOrder.result.id;
        await order.save();

        // Devolver la URL de aprobación para que el usuario pueda realizar el pago
        res.json({
          approval_url: payPalOrder.result.links.find(link => link.rel === 'approve').href,
        });
      } catch (error) {
        return res.status(500).json({ message: 'Error al crear el pago con PayPal', error });
      }
    } else {
      // Si el pago no es con PayPal, podríamos procesarlo de otra manera (p. ej. con WISE o Stripe)
      // Para este ejemplo, solo guardamos la orden sin el flujo de pago.
      res.status(201).json(order);
    }

    // Vaciar el carrito después del pago (independientemente del método de pago)
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();
  } catch (error) {
    res.status(500).json({ message: 'Error al procesar el checkout', error });
  }
};

export const capturePayment = async (req, res) => {
  const { orderId } = req.query;
  const order = await Order.findById(orderId);

  if (!order) {
    return res.status(404).json({ message: 'Orden no encontrada' });
  }

  const request = new paypal.orders.OrdersCaptureRequest(order.paypalPaymentId);
  request.requestBody({});

  try {
    const capture = await client.execute(request);

    // Aquí, 'capture' contiene la respuesta del pago, que tiene detalles de la transacción
    const captureDetails = capture.result.purchase_units[0].payments.captures[0];


    // Actualizar la orden como pagada
    order.isPaid = true;
    order.paidAt = new Date();
    order.status = 'Processing';// Cambiar estado de la orden a "Procesando"
    order.paymentDetails = {
      transactionId: captureDetails.id,
      amount: captureDetails.amount.value,
      currency: captureDetails.amount.currency_code,
      status: captureDetails.status,
    };

    await order.save();

    res.redirect(`${process.env.CLIENT_URL}/order/${orderId}`);
  } catch (error) {
    res.status(500).json({ message: 'Error al capturar el pago', error });
  }
};
