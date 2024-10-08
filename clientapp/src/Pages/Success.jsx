import React, { useEffect } from 'react';

const Success = () => {
  console.log("success is loaded")
  useEffect(() => {
    // This will run only when the component is mounted (when the /success page is loaded)
    const storedUser = sessionStorage.getItem("user");
    console.log("Brukeren er " + storedUser);
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  return (
    <h1>60 er gay</h1>
  );
}

export default Success;