import React, { useEffect, useContext } from 'react';
import LoggedIn from './LoggedIn.jsx';
import LoggedOut from './LoggedOut.jsx';
import useSiteMetadata from '../../hooks/use-site-metadata';
import { UserStateContext, UserDispatchContext } from '../../contexts/User/UserContext';

/**
 * Show either a Login button (if user isn't authenticated)
 * or a welcome message and Logout button.
 */

function Login() {
  const { telescopeUrl } = useSiteMetadata();
  const user = useContext(UserStateContext);
  const dispatch = useContext(UserDispatchContext);

  useEffect(() => {
    // Try to get user session info from the server.
    async function getUserInfo() {
      if (user && user.name) return;
      try {
        // See if the server has session info on this user
        const response = await fetch(`${telescopeUrl}/user/info`);

        if (!response.ok) {
          // Not an error, we're just not authenticated
          if (response.status === 403) {
            return;
          }
          throw new Error(response.statusText);
        }

        const userInfo = await response.json();
        if (userInfo && userInfo.email && userInfo.name) {
          dispatch({ type: 'LOGIN_USER', payload: userInfo });
        }
      } catch (error) {
        console.error('Error getting user info', error);
      }
    }

    getUserInfo();
  }, [telescopeUrl, dispatch]);

  return user && user.email ? <LoggedIn /> : <LoggedOut />;
}

export default Login;
