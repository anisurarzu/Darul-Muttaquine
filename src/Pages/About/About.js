import React, { useEffect } from "react";

export default function About() {
  const reloadUntilToken = () => {
    if (!localStorage.getItem("token")) {
      // Reload the page if token is not found
      window.location.reload();
    }
  };

  useEffect(() => {
    // Call the reloadUntilToken function on initial render
    reloadUntilToken();
  }, []);

  return <div>About</div>;
}
