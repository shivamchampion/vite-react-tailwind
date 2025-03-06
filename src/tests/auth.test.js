// src/tests/auth.test.js
import { 
    render, 
    screen, 
    fireEvent, 
    waitFor 
  } from '@testing-library/react';
  import userEvent from '@testing-library/user-event';
  import { AuthProvider } from '../contexts/AuthContext';
  import AuthModal from '../components/auth/AuthModal';
  
  // Mock Firebase Authentication
  jest.mock('firebase/auth', () => ({
    ...jest.requireActual('firebase/auth'),
    createUserWithEmailAndPassword: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    signInWithPopup: jest.fn(),
    signOut: jest.fn(),
  }));
  
  describe('Authentication Flow', () => {
    // Test user credentials
    const validUser = {
      email: 'test@example.com',
      password: 'ValidPassword123!',
      name: 'Test User'
    };
  
    const invalidCredentials = {
      email: 'invalid-email',
      password: 'short'
    };
  
    // Setup and teardown
    beforeEach(() => {
      // Reset all mocks before each test
      jest.clearAllMocks();
    });
  
    // Login Validation Tests
    describe('Login Validation', () => {
      test('displays error for invalid email', async () => {
        render(
          <AuthProvider>
            <AuthModal isOpen={true} initialTab="login" />
          </AuthProvider>
        );
  
        // Fill out form with invalid email
        await userEvent.type(
          screen.getByPlaceholderText('you@example.com'), 
          invalidCredentials.email
        );
        await userEvent.type(
          screen.getByPlaceholderText('••••••••'), 
          validUser.password
        );
  
        // Submit form
        fireEvent.click(screen.getByText(/log in/i));
  
        // Check for validation error
        await waitFor(() => {
          expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
        });
      });
  
      test('displays error for invalid password', async () => {
        render(
          <AuthProvider>
            <AuthModal isOpen={true} initialTab="login" />
          </AuthProvider>
        );
  
        // Fill out form with valid email but invalid password
        await userEvent.type(
          screen.getByPlaceholderText('you@example.com'), 
          validUser.email
        );
        await userEvent.type(
          screen.getByPlaceholderText('••••••••'), 
          invalidCredentials.password
        );
  
        // Submit form
        fireEvent.click(screen.getByText(/log in/i));
  
        // Check for validation error
        await waitFor(() => {
          expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
        });
      });
    });
  
    // Registration Validation Tests
    describe('Registration Validation', () => {
      test('displays error for mismatched passwords', async () => {
        render(
          <AuthProvider>
            <AuthModal isOpen={true} initialTab="register" />
          </AuthProvider>
        );
  
        // Switch to registration tab
        fireEvent.click(screen.getByText(/register/i));
  
        // Fill out form with mismatched passwords
        await userEvent.type(
          screen.getByPlaceholderText('Enter your full name'), 
          validUser.name
        );
        await userEvent.type(
          screen.getByPlaceholderText('you@example.com'), 
          validUser.email
        );
        await userEvent.type(
          screen.getByPlaceholderText('••••••••'), 
          validUser.password
        );
        await userEvent.type(
          screen.getByPlaceholderText('Confirm your password'), 
          'DifferentPassword123!'
        );
  
        // Submit form
        fireEvent.click(screen.getByText(/create account/i));
  
        // Check for password mismatch error
        await waitFor(() => {
          expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
        });
      });
  
      test('requires strong password for registration', async () => {
        render(
          <AuthProvider>
            <AuthModal isOpen={true} initialTab="register" />
          </AuthProvider>
        );
  
        // Switch to registration tab
        fireEvent.click(screen.getByText(/register/i));
  
        // Fill out form with weak password
        await userEvent.type(
          screen.getByPlaceholderText('Enter your full name'), 
          validUser.name
        );
        await userEvent.type(
          screen.getByPlaceholderText('you@example.com'), 
          validUser.email
        );
        await userEvent.type(
          screen.getByPlaceholderText('••••••••'), 
          'weakpassword'
        );
        await userEvent.type(
          screen.getByPlaceholderText('Confirm your password'), 
          'weakpassword'
        );
  
        // Submit form
        fireEvent.click(screen.getByText(/create account/i));
  
        // Check for password strength error
        await waitFor(() => {
          expect(
            screen.getByText(/password must be at least 8 characters/i)
          ).toBeInTheDocument();
        });
      });
    });
  
    // Social Login Tests
    describe('Social Login', () => {
      test('initiates Google login', async () => {
        const mockGoogleSignIn = require('firebase/auth').signInWithPopup;
        mockGoogleSignIn.mockResolvedValue({
          user: {
            uid: 'test-google-user',
            email: 'google-user@example.com',
            displayName: 'Google User'
          }
        });
  
        render(
          <AuthProvider>
            <AuthModal isOpen={true} />
          </AuthProvider>
        );
  
        // Click Google login button
        const googleButton = screen.getByLabelText(/sign in with google/i);
        fireEvent.click(googleButton);
  
        // Verify Google sign-in was called
        await waitFor(() => {
          expect(mockGoogleSignIn).toHaveBeenCalled();
        });
      });
    });
  
    // Authentication State Tests
    describe('Authentication State', () => {
      test('updates user state after successful login', async () => {
        const mockSignIn = require('firebase/auth').signInWithEmailAndPassword;
        mockSignIn.mockResolvedValue({
          user: {
            uid: 'test-user',
            email: validUser.email
          }
        });
  
        const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
  
        // Perform login
        await act(async () => {
          await result.current.login(validUser.email, validUser.password);
        });
  
        // Check user state
        expect(result.current.currentUser).toBeTruthy();
        expect(result.current.currentUser.email).toBe(validUser.email);
      });
    });
  });