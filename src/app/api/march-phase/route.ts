import { NextRequest, NextResponse } from 'next/server';
import { MarchService } from '@/services/marchService';

const marchService = new MarchService();

// GET /api/march-phase?clientId=xxx - Get current phase
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    if (!clientId) {
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 }
      );
    }

    const currentPhase = await marchService.getCurrentPhase(clientId);
    
    if (!currentPhase) {
      return NextResponse.json(
        { error: 'No phase assessment found' },
        { status: 404 }
      );
    }

    const guidance = marchService.getPhaseGuidance(currentPhase.decidedPhase);
    const recommendations = marchService.getPhaseTransitionRecommendations(
      currentPhase.decidedPhase,
      currentPhase
    );

    return NextResponse.json({
      assessment: currentPhase,
      guidance,
      recommendations,
      status: await marchService.getWeeklyStatus(clientId)
    });

  } catch (error) {
    console.error('Error fetching M.A.R.C.H. phase:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/march-phase - Compute new phase assessment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientId, weekStart } = body;

    if (!clientId) {
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 }
      );
    }

    const weekStartDate = weekStart ? new Date(weekStart) : new Date();
    const assessment = await marchService.computeWeeklyAssessment(clientId, weekStartDate);
    
    const guidance = marchService.getPhaseGuidance(assessment.decidedPhase);
    const recommendations = marchService.getPhaseTransitionRecommendations(
      assessment.decidedPhase,
      assessment
    );

    return NextResponse.json({
      assessment,
      guidance,
      recommendations,
      message: 'Phase assessment computed successfully'
    });

  } catch (error) {
    console.error('Error computing M.A.R.C.H. phase:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


