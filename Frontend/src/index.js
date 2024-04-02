import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Utilities from "./components/utilities/utilities";

const root = ReactDOM.createRoot(document.getElementById("root"));
const utilities = new Utilities();

function RenderAppAfterDataLoaded() {
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await utilities.componentDidMount();
      console.log("Posts - IndexJs");
      console.log(utilities.state.posts);
      console.log(response);
      setDataLoaded(true);
    };

    fetchData();
  }, [utilities]);

  return (
    <>
      {dataLoaded && (
        <React.StrictMode>
          <App utilities={utilities} />
        </React.StrictMode>
      )}
    </>
  );
}

root.render(<RenderAppAfterDataLoaded />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
