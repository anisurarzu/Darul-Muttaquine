import React, { useState } from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, ...rest }) => {
  // Check if the user is authenticated (you can implement this logic based on your authentication mechanism)
  const isAuthenticated = !!localStorage.getItem("token");

  // State to store the intended destination before login
  const [redirectTo, setRedirectTo] = useState(null);

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }, // Pass the current location as state
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
