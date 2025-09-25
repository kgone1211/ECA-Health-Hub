import { NextRequest, NextResponse } from 'next/server';
import { MarchService } from '@/services/marchService';

const marchService = new MarchService();

// GET /api/march-phase/history?clientId=xxx&limit=12 - Get phase history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    const limit = parseInt(searchParams.get('limit') || '12');

    if (!clientId) {
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 }
      );
    }

    const history = await marchService.getPhaseHistory(clientId, limit);
    
    // Add guidance for each phase in history
    const historyWithGuidance = history.map(assessment => ({
      ...assessment,
      guidance: marchService.getPhaseGuidance(assessment.decidedPhase)
    }));

    return NextResponse.json({
      history: historyWithGuidance,
      count: history.length
    });

  } catch (error) {
    console.error('Error fetching M.A.R.C.H. phase history:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

