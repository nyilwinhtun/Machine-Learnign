import { fireEvent, render, screen } from '@testing-library/react';
import App from '../App';
import { mlCoreData } from '../data/mlCoreData';

describe('CoreFlowchart and Phase 2 Study UI', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders all 6 ML Core steps in the flowchart', () => {
    render(<App />);

    mlCoreData.forEach((lesson) => {
      const stepButton = screen.getByTestId(`flowchart-step-${lesson.stepNumber}`);
      expect(stepButton).toBeInTheDocument();
      expect(stepButton).toHaveTextContent(lesson.titleEn);
    });
  });

  it('updates the displayed Burmese analogy and vocabulary when clicking a step', () => {
    render(<App />);

    // Initially Step 1 is selected
    expect(screen.getByText(mlCoreData[0].analogyMm)).toBeInTheDocument();

    // Click Step 5 (Overfitting vs. Underfitting)
    const step5 = mlCoreData[4];
    fireEvent.click(screen.getByTestId(`flowchart-step-${step5.stepNumber}`));

    expect(screen.getByText(step5.analogyMm)).toBeInTheDocument();
    step5.vocabulary.forEach((vocab) => {
      expect(screen.getByText(vocab.term)).toBeInTheDocument();
      expect(screen.getByText(vocab.definitionMm)).toBeInTheDocument();
    });
  });

  it('toggles UI labels and flowchart step titles between EN and မြန်မာ', () => {
    render(<App />);

    // Default EN mode shows English title on Step 1
    const step1Button = screen.getByTestId('flowchart-step-1');
    expect(step1Button).toHaveTextContent(mlCoreData[0].titleEn);

    // Click EN / မြန်မာ toggle button
    const toggleButton = screen.getByRole('button', {
      name: /Toggle language EN \/ မြန်မာ/i,
    });
    fireEvent.click(toggleButton);

    // Now Burmese title and Burmese tab labels appear
    expect(step1Button).toHaveTextContent(mlCoreData[0].titleMm);
    expect(
      screen.getByText(/⭐ မဖြစ်မနေသိရမည့် ML အခြေခံ/i)
    ).toBeInTheDocument();
  });

  it('saves a lesson to the Review Deck and updates the badge count', () => {
    render(<App />);

    const saveButton = screen.getByRole('button', {
      name: /Save to Review Deck/i,
    });
    fireEvent.click(saveButton);

    expect(
      screen.getByRole('button', { name: /Saved to Review Deck/i })
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Saved flashcards: 1/i)
    ).toBeInTheDocument();
  });
});
