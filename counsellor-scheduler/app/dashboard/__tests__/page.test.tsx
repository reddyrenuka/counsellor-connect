import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import DashboardPage from '../page';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

describe('Dashboard Page - Counsellor Profile', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    
    // Mock successful auth and appointments
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url === '/api/auth/session') {
        return Promise.resolve({
          ok: true,
          json: async () => ({ user: { name: 'Test User', email: 'test@example.com' } }),
        });
      }
      if (url === '/api/appointments/list') {
        return Promise.resolve({
          ok: true,
          json: async () => ({ appointments: [] }),
        });
      }
      return Promise.resolve({ ok: false });
    });
  });

  describe('Counsellor Profile Section', () => {
    it('should display "Your Counsellor" heading', async () => {
      render(<DashboardPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Your Counsellor')).toBeInTheDocument();
      });
    });

    it('should display counsellor name "Tanuja Reddy"', async () => {
      render(<DashboardPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Tanuja Reddy')).toBeInTheDocument();
      });
    });

    it('should display counsellor credentials', async () => {
      render(<DashboardPage />);
      
      await waitFor(() => {
        expect(screen.getByText(/M\.A\. in Psychology/i)).toBeInTheDocument();
        expect(screen.getByText(/Post Graduate Diploma in Counselling/i)).toBeInTheDocument();
      });
    });

    it('should display counsellor bio with key phrases', async () => {
      render(<DashboardPage />);
      
      await waitFor(() => {
        expect(screen.getByText(/professional Counsellor and Psychologist/i)).toBeInTheDocument();
        expect(screen.getByText(/over a decade of rich, diverse experience/i)).toBeInTheDocument();
        expect(screen.getByText(/supporting military personnel and their families/i)).toBeInTheDocument();
        expect(screen.getByText(/warm, non-judgmental/i)).toBeInTheDocument();
      });
    });

    it('should display photo placeholder', async () => {
      render(<DashboardPage />);
      
      await waitFor(() => {
        // Check for the SVG icon (user icon) in the placeholder
        const svgElements = screen.getAllByRole('img', { hidden: true });
        expect(svgElements.length).toBeGreaterThan(0);
      });
    });

    it('should display WhatsApp contact button with correct link', async () => {
      render(<DashboardPage />);
      
      await waitFor(() => {
        const whatsappLink = screen.getByRole('link', { name: /Chat on WhatsApp/i });
        expect(whatsappLink).toBeInTheDocument();
        expect(whatsappLink).toHaveAttribute('href', 'https://wa.me/918609051359');
        expect(whatsappLink).toHaveAttribute('target', '_blank');
        expect(whatsappLink).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });

    it('should display WhatsApp phone number in button', async () => {
      render(<DashboardPage />);
      
      await waitFor(() => {
        expect(screen.getByText('+91 86090 51359')).toBeInTheDocument();
      });
    });

    it('should display profile section before dashboard appointments', async () => {
      render(<DashboardPage />);
      
      await waitFor(() => {
        const counsellorHeading = screen.getByText('Your Counsellor');
        const dashboardHeading = screen.getByText('My Dashboard');
        
        expect(counsellorHeading).toBeInTheDocument();
        expect(dashboardHeading).toBeInTheDocument();
        
        // Verify counsellor section appears before dashboard section
        const counsellorElement = counsellorHeading.closest('div');
        const dashboardElement = dashboardHeading.closest('div');
        
        if (counsellorElement && dashboardElement) {
          expect(counsellorElement.compareDocumentPosition(dashboardElement))
            .toBe(Node.DOCUMENT_POSITION_FOLLOWING);
        }
      });
    });
  });

  describe('Dashboard Integration', () => {
    it('should display counsellor profile alongside user appointments', async () => {
      (global.fetch as jest.Mock).mockImplementation((url: string) => {
        if (url === '/api/auth/session') {
          return Promise.resolve({
            ok: true,
            json: async () => ({ user: { name: 'Test User', email: 'test@example.com' } }),
          });
        }
        if (url === '/api/appointments/list') {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              appointments: [
                {
                  id: '1',
                  clientEmail: 'test@example.com',
                  clientName: 'Test User',
                  date: '2026-03-20',
                  time: '10:00',
                  topic: 'Anxiety',
                  status: 'confirmed',
                  createdAt: '2026-03-16T10:00:00Z',
                },
              ],
            }),
          });
        }
        return Promise.resolve({ ok: false });
      });

      render(<DashboardPage />);
      
      await waitFor(() => {
        // Both counsellor profile and appointments should be visible
        expect(screen.getByText('Your Counsellor')).toBeInTheDocument();
        expect(screen.getByText('Tanuja Reddy')).toBeInTheDocument();
        expect(screen.getByText('Upcoming Appointments')).toBeInTheDocument();
      });
    });
  });
});
