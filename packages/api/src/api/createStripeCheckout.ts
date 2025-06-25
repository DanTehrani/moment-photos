/*
import { CreateStripeCheckoutRequestBody } from '../rpcTypes';
import Stripe from 'stripe';



const createStripeCheckout = async (input: CreateStripeCheckoutRequestBody) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-05-28.basil',
  });

  const { userId, credits, priceId } = input;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.WEB_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.WEB_URL}/cancel`,
    metadata: {
      userId,
      credits,
    },
  });

  return {
    url: session.url,
  };
};

export default createStripeCheckout;

*/
