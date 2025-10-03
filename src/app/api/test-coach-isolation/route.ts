import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET() {
  try {
    console.log('🧪 Testing Multi-Coach Isolation...\n');

    // Create Coach 1
    const coach1 = await db.upsertUser('coach1_whop_id', 'coach1@example.com', 'Coach Mike', 'Mike Johnson', true);
    if (!coach1) throw new Error('Failed to create coach 1');
    await db.createCoachProfile(coach1.id, 'Weight Loss', 'Certified personal trainer');

    // Create Coach 2
    const coach2 = await db.upsertUser('coach2_whop_id', 'coach2@example.com', 'Coach Sarah', 'Sarah Williams', true);
    if (!coach2) throw new Error('Failed to create coach 2');
    await db.createCoachProfile(coach2.id, 'Nutrition', 'Registered dietitian');

    // Create Clients
    const client1 = await db.upsertUser('client1_whop_id', 'client1@example.com', 'John', 'John Doe', false);
    const client2 = await db.upsertUser('client2_whop_id', 'client2@example.com', 'Jane', 'Jane Smith', false);
    const client3 = await db.upsertUser('client3_whop_id', 'client3@example.com', 'Bob', 'Bob Brown', false);

    if (!client1 || !client2 || !client3) throw new Error('Failed to create clients');

    // Assign clients to coaches
    await db.addClientToCoach(coach1.id, client1.id); // Coach 1 -> Client 1
    await db.addClientToCoach(coach1.id, client2.id); // Coach 1 -> Client 2
    await db.addClientToCoach(coach2.id, client3.id); // Coach 2 -> Client 3

    // Add health metrics for each client
    await db.addHealthMetric(client1.id, 'weight', 200, 'lbs', 'Initial weight - Coach 1 Client');
    await db.addHealthMetric(client2.id, 'weight', 150, 'lbs', 'Initial weight - Coach 1 Client');
    await db.addHealthMetric(client3.id, 'weight', 180, 'lbs', 'Initial weight - Coach 2 Client');

    // Create sessions
    await db.createSession(coach1.id, client1.id, new Date(), 60, 'initial');
    await db.createSession(coach1.id, client2.id, new Date(), 60, 'initial');
    await db.createSession(coach2.id, client3.id, new Date(), 60, 'initial');

    // TEST ISOLATION: Get data for each coach
    const coach1Clients = await db.getCoachClients(coach1.id);
    const coach2Clients = await db.getCoachClients(coach2.id);
    
    const coach1Sessions = await db.getCoachSessionsWithClients(coach1.id);
    const coach2Sessions = await db.getCoachSessionsWithClients(coach2.id);

    // Test accessing client data
    const coach1ViewClient1Metrics = await db.getClientHealthMetrics(coach1.id, client1.id);
    const coach1ViewClient3Metrics = await db.getClientHealthMetrics(coach1.id, client3.id); // Should be empty - not their client!

    return NextResponse.json({
      success: true,
      message: '✅ Multi-Coach Isolation Test Complete!',
      results: {
        coach1: {
          name: coach1.username,
          clients: coach1Clients.length,
          clientNames: coach1Clients.map((c: any) => c.client?.username),
          sessions: coach1Sessions.length,
          canAccessClient1Data: coach1ViewClient1Metrics.length > 0,
          canAccessClient3Data: coach1ViewClient3Metrics.length > 0, // Should be FALSE
        },
        coach2: {
          name: coach2.username,
          clients: coach2Clients.length,
          clientNames: coach2Clients.map((c: any) => c.client?.username),
          sessions: coach2Sessions.length,
        },
        isolation: {
          coach1HasOnlyTheirClients: coach1Clients.length === 2,
          coach2HasOnlyTheirClients: coach2Clients.length === 1,
          coach1CannotAccessCoach2Clients: coach1ViewClient3Metrics.length === 0,
          allIsolationTestsPassed: 
            coach1Clients.length === 2 && 
            coach2Clients.length === 1 && 
            coach1ViewClient3Metrics.length === 0
        }
      }
    });

  } catch (error) {
    console.error('❌ Coach isolation test failed:', error);
    return NextResponse.json({
      error: 'Coach isolation test failed',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

