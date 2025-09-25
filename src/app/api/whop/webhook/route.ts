import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Whop webhook received:', body);
    
    // Verify webhook signature if needed
    const signature = request.headers.get('whop-signature');
    
    // Handle different webhook events
    switch (body.event) {
      case 'user.created':
        console.log('New user created:', body.data);
        // Handle new user creation
        break;
        
      case 'user.updated':
        console.log('User updated:', body.data);
        // Handle user updates
        break;
        
      case 'subscription.created':
        console.log('New subscription created:', body.data);
        // Handle new subscription
        break;
        
      case 'subscription.updated':
        console.log('Subscription updated:', body.data);
        // Handle subscription updates
        break;
        
      case 'subscription.cancelled':
        console.log('Subscription cancelled:', body.data);
        // Handle subscription cancellation
        break;
        
      default:
        console.log('Unknown webhook event:', body.event);
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
