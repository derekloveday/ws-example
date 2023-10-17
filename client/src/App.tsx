import React, { useEffect, useState } from "react";

const App = () => {
  const [data, setData] = useState("");

  useEffect(() => {
    // fetch("http://localhost:3000/api/hello")
    //   .then((res) => res.json())
    //   .then((obj) => setData(obj.message));
    const fetchData = async () => {
      try {
        const result = await fetch("http://localhost:3000/api/hello");
        const message = (await result.json()).message;
        setData(message);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <h1>Test:</h1>
      <div>Hello {data}</div>
    </>
  );
};

export default App;
