# EFH Health Hub v2.0

A comprehensive health coaching platform built with Next.js 15, featuring M.A.R.C.H. phase detection, gamification, and client management.

## Features

### 🎯 M.A.R.C.H. Phase Detection
- **M**ovement: Exercise tracking and workout management
- **A**lcohol: Alcohol consumption monitoring
- **R**ecovery: Sleep and stress tracking
- **C**hemistry: Nutrition and supplement tracking
- **H**abits: Daily habit formation and tracking

### 🏆 Gamification System
- Points and achievements
- Challenge creation and management
- Progress tracking with visual indicators
- Leaderboards and social features

### 📊 Health Metrics Dashboard
- Comprehensive health data visualization
- Trend analysis and insights
- Goal setting and progress tracking
- Customizable metrics

### 👥 Client Management
- Client onboarding and form submission
- Personalized workout plans
- Macro tracking and nutrition guidance
- Progress photo management

### 📱 Modern UI/UX
- Responsive design with Tailwind CSS
- Glassmorphism design elements
- Dark/light theme support
- Mobile-first approach

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Database**: In-memory (development), Vercel Postgres (production)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/zekegonzalez/eca-health-hub-v2.git
cd eca-health-hub-v2
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Whop Integration (Required for Whop deployment)
WHOP_API_KEY=your_whop_api_key_here
NEXT_PUBLIC_WHOP_APP_ID=app_ECA_Health_Hub_v2
NEXT_PUBLIC_WHOP_AGENT_USER_ID=your_agent_user_id
NEXT_PUBLIC_WHOP_COMPANY_ID=your_company_id

# Add other environment variables here
# For production deployment, configure these in Vercel
```

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on every push

### Whop Integration

This app includes full Whop integration for deployment on the Whop platform:

- **Whop-specific page**: `/whop` - Optimized for iframe embedding
- **Authentication**: Automatic user validation and subscription checking
- **Webhooks**: Support for Whop webhook events
- **Environment**: Test mode for local development

See `WHOP_SETUP.md` for detailed Whop integration setup instructions.

### Build Configuration

The project is configured to ignore ESLint and TypeScript errors during build for deployment. This can be adjusted in `next.config.js`:

```javascript
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}
```

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── challenges/        # Challenges page
│   ├── check-ins/         # Check-ins page
│   ├── client-dashboard/  # Client dashboard
│   ├── gamification/      # Gamification page
│   ├── health-metrics/    # Health metrics page
│   ├── journal/           # Journal page
│   ├── macros/            # Macros page
│   ├── march-phase/       # M.A.R.C.H. phase page
│   └── workouts/          # Workouts page
├── components/            # Reusable React components
├── config/               # Configuration files
├── contexts/             # React contexts
├── domain/               # Business logic
├── lib/                  # Utility libraries
├── services/             # Service layers
├── types/                # TypeScript type definitions
└── tests/                # Test files
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email zeke@example.com or create an issue in the GitHub repository.