# Personal Finance Visualizer

A modern, responsive web application for tracking and visualizing personal finances. Built with Next.js, TypeScript, and MongoDB.

![Personal Finance Visualizer](public/screenshot.png)

## Features

- 📊 **Interactive Charts**

  - Monthly expenses tracking with bar charts
  - Category-wise spending distribution with pie charts
  - Budget vs. actual spending comparisons
  - Responsive and mobile-friendly visualizations

- 💰 **Transaction Management**

  - Add, edit, and delete transactions
  - Categorize expenses
  - Track spending patterns
  - Export transaction history

- 📈 **Spending Insights**

  - Month-over-month spending comparisons
  - Top spending category analysis
  - Budget alerts and warnings
  - Spending trend analysis

- 🎨 **Modern UI/UX**
  - Clean, intuitive interface
  - Dark mode support
  - Responsive design
  - Smooth animations and transitions

## Tech Stack

- **Frontend**

  - Next.js 14
  - TypeScript
  - Tailwind CSS
  - Recharts
  - GSAP for animations
  - Lucide Icons

- **Backend**
  - MongoDB
  - Next.js API Routes
  - TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB instance (local or Atlas)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/personal-finance-visualizer.git
   cd personal-finance-visualizer
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory:

   ```
   MONGODB_URI=your_mongodb_connection_string
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Setup

The application will automatically seed initial categories when you first run it. You can also manually seed the database using the provided API endpoints:

- `/api/seed` - Seeds initial categories
- `/api/seed-sample-data` - Seeds sample transactions and budgets

## Project Structure

```
personal-finance-visualizer/
├── app/
│   ├── api/              # API routes
│   ├── page.tsx          # Main page component
│   └── layout.tsx        # Root layout
├── components/
│   ├── ui/               # Reusable UI components
│   ├── MonthlyExpensesChart.tsx
│   ├── CategoryPieChart.tsx
│   ├── SpendingInsights.tsx
│   └── ...
├── lib/
│   ├── types.ts          # TypeScript types
│   └── utils.ts          # Utility functions
└── public/               # Static assets
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Icons by [Lucide](https://lucide.dev)
- Charts by [Recharts](https://recharts.org)
- Animations by [GSAP](https://greensock.com/gsap/)
