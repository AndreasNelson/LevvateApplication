export interface PaymentIntent {
  clientSecret: string;
  intentId: string;
  amount: number;
  currency: string;
}

export interface PaymentConfirmation {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export class StripeService {
  static async createPaymentIntent(amount: number): Promise<PaymentIntent> {
    // Mock Stripe payment intent creation
    const intentId = `pi_${Math.random().toString(36).substring(7)}`;
    const clientSecret = `${intentId}_secret_${Math.random().toString(36).substring(7)}`;

    console.log(`[Stripe Mock] Created payment intent:`, {
      intentId,
      amount,
      currency: 'usd',
      timestamp: new Date().toISOString()
    });

    return {
      clientSecret,
      intentId,
      amount,
      currency: 'usd'
    };
  }

  static async confirmPayment(intentId: string, paymentMethodId: string): Promise<PaymentConfirmation> {
    // Mock payment confirmation
    console.log(`[Stripe Mock] Confirmed payment:`, {
      intentId,
      paymentMethodId,
      status: 'succeeded',
      timestamp: new Date().toISOString()
    });

    await new Promise(resolve => setTimeout(resolve, 100));

    return {
      success: true,
      transactionId: `txn_${Math.random().toString(36).substring(7)}`
    };
  }
}

export default StripeService;
