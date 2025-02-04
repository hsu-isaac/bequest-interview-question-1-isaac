import React, { useEffect, useState } from "react";
import sha256 from "crypto-js/sha256";
import encHex from "crypto-js/enc-hex";

const API_URL = "http://localhost:8080";

function App() {
  const [data, setData] = useState<string>();
  const [hash, setHash] = useState<string>();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const response = await fetch(API_URL);
    const { data, hash } = await response.json();
    setData(data);
    setHash(hash);
  };

  const updateData = async () => {
    if (data === undefined) {
      return;
    }

    const newData = data;
    const newHash = sha256(newData).toString(encHex);
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ data: newData, hash: newHash }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    await getData();
  };

  const verifyData = async () => {
    if (data === undefined || hash === undefined) {
      return;
    }

    const currentHash = sha256(data).toString(encHex);
    if (currentHash === hash) {
      alert("Data integrity verified!");
    } else {
      alert("Data integrity verification failed");

      const backupData = data;

      const userInput = prompt("Please enter the correct data: ");

      if (userInput !== null) {
        setData(userInput);
        const updatedHash = sha256(userInput).toString(encHex);

        await fetch(API_URL, {
          method: "POST",
          body: JSON.stringify({ data: userInput, hash: updatedHash }),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        await getData();
      } else {
        setData(backupData);
        console.log("User canceled data update. Restored backup data.");
      }
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        position: "absolute",
        padding: 0,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "20px",
        fontSize: "30px",
      }}
    >
      <div>Saved Data</div>
      <input
        style={{ fontSize: "30px" }}
        type="text"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />

      <div style={{ display: "flex", gap: "10px" }}>
        <button style={{ fontSize: "20px" }} onClick={updateData}>
          Update Data
        </button>
        <button style={{ fontSize: "20px" }} onClick={verifyData}>
          Verify Data
        </button>
      </div>
    </div>
  );
}

export default App;
