import { useContext, createContext } from 'react';
import { useStorageState } from './useStorageState';

const AuthContext = createContext({
  signIn: async () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
  userData: null,
});

export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }
  return value;
}

export function SessionProvider({ children }) {
  const [[isLoading, session], setSession] = useStorageState('session');
  const [[, userData], setUserData] = useStorageState('userData');

  return (
    <AuthContext.Provider
      value={{
        signIn: async (email, password, apiUrl) => {
          try {
            const response = await fetch(`${apiUrl}/auth`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (!response.ok) {
              throw new Error(result.message || 'Error en la autenticación');
            }

            await setSession(result.data.token);
            await setUserData(JSON.stringify(result.data));
            return { success: true };
          } catch (error) {
            console.error('Error signing in:', error);
            return { 
              success: false, 
              error: error.message || 'Error al iniciar sesión' 
            };
          }
        },
        signOut: async () => {
          await setSession(null);
          await setUserData(null);
        },
        session,
        isLoading,
        userData: userData ? JSON.parse(userData) : null,
      }}>
      {children}
    </AuthContext.Provider>
  );
}