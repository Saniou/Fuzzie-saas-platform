import { NextResponse, NextRequest } from 'next/server'
import Stripe from 'stripe'

// Ліниве створення клієнта: не інстанціюємо Stripe на рівні модуля,
// інакше білд падає під час "collecting page data" без STRIPE_SECRET.
const getStripe = () =>
  new Stripe(process.env.STRIPE_SECRET!, {
    typescript: true,
    apiVersion: '2025-07-30.basil',
  })

// Базовий URL застосунку для redirect-ів Stripe (без хардкоду localhost)
const appUrl = process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000'

export async function GET(req: NextRequest) {
  const stripe = getStripe()
  const products = await stripe.prices.list({
    limit: 3,
  })

  return NextResponse.json(products.data)
}

export async function POST(req: NextRequest) {
  const stripe = getStripe()
  const data = await req.json()
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: data.priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${appUrl}/billing?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/billing`,
  })
  return NextResponse.json(session.url)
}