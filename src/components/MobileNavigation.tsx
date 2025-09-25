'use client';

import { useRouter } from 'next/navigation';

export default function MobileNavigation() {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    if (path) {
      router.push(path);
    }
  };

  return (
    <select 
      className="text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-300 transition-all duration-200 shadow-sm"
      onChange={(e) => handleNavigation(e.target.value)}
      defaultValue=""
    >
      <option value="">Navigate...</option>
      <option value="/">Dashboard</option>
      <option value="/health-metrics">Health Metrics</option>
      <option value="/macros">Macros</option>
      <option value="/workouts">Workouts</option>
      <option value="/journal">Journal</option>
      <option value="/check-ins">Check-ins</option>
      <option value="/gamification">Gamification</option>
      <option value="/march-phase">M.A.R.C.H. Phases</option>
      <option value="/client-dashboard">Client View</option>
    </select>
  );
}
