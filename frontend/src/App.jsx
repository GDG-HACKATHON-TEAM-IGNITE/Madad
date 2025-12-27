import './App.css';
import { useEffect, useState } from 'react';
import UserDetails from './components/Userdetails';

// Firebase v9 imports
import { auth, googleProvider } from './config/firebase-config';
import { onAuthStateChanged, signInWithPopup } from 'firebase/auth';

function App() {
  const [isAuth, setIsAuth] = useState(
    window.localStorage.getItem('auth') === 'true'
  );
  const [token, setToken] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuth(true);
        window.localStorage.setItem('auth', 'true');
        const token = await user.getIdToken();
        setToken(token);
      } else {
        setIsAuth(false);
        window.localStorage.removeItem('auth');
        setToken('');
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        setIsAuth(true);
        window.localStorage.setItem('auth', 'true');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="App">
      {isAuth ? (
        <UserDetails token={token} />
      ) : (
        <button onClick={loginWithGoogle}>
          Login with Google
        </button>
      )}
    </div>
  );
}

export default App;
