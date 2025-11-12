import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

describe('App Component', () => {
    it('renders without crashing', () => {
        render(<App />);
        // Just check that the component renders without errors
        expect(document.body).toBeInTheDocument();
    });
});