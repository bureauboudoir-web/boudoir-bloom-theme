import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LanguageSelector } from '@/components/LanguageSelector';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client');

describe('LanguageSelector', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders with globe icon', () => {
    render(<LanguageSelector />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('shows all 5 languages when opened', async () => {
    render(<LanguageSelector />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/English/i)).toBeInTheDocument();
      expect(screen.getByText(/Español/i)).toBeInTheDocument();
      expect(screen.getByText(/Italiano/i)).toBeInTheDocument();
      expect(screen.getByText(/Русский/i)).toBeInTheDocument();
      expect(screen.getByText(/Français/i)).toBeInTheDocument();
    });
  });

  it('saves language preference to localStorage', async () => {
    render(<LanguageSelector />);
    
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      const spanishOption = screen.getByText(/Español/i);
      fireEvent.click(spanishOption);
    });

    expect(localStorage.getItem('preferred_language')).toBe('es');
  });

  it('displays correct flag emojis', async () => {
    render(<LanguageSelector />);
    
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText('🇬🇧')).toBeInTheDocument();
      expect(screen.getByText('🇪🇸')).toBeInTheDocument();
      expect(screen.getByText('🇮🇹')).toBeInTheDocument();
      expect(screen.getByText('🇷🇺')).toBeInTheDocument();
      expect(screen.getByText('🇫🇷')).toBeInTheDocument();
    });
  });
});
