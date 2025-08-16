// App.js
import "./App.css";
import { useState, useEffect } from "react";
import Axios from "axios";

function App() {
  const [passwords, setPasswords] = useState("");
  const [title, setTitle] = useState("");
  const [passwordList, setPasswordList] = useState([]);
  const [decryptedId, setDecryptedId] = useState(null); // New state to track the decrypted password's ID

  useEffect(() => {
    Axios.get("http://localhost:3001/getpasswords")
      .then((response) => {
        setPasswordList(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the passwords:", error);
      });
  }, []);

  const addPassword = () => {
    Axios.post("http://localhost:3001/addpassword", {
      passwords: passwords,
      title: title,
    })
      .then((response) => {
        console.log(response.data);
        alert("Password added successfully");
      })
      .catch((error) => {
        console.error("There was an error adding the password:", error);
        alert("Error adding password");
      });
  };

  const togglePassword = (encryption) => {
    if (decryptedId === encryption.id) {
      // If the same password is clicked, hide it
      setDecryptedId(null);
    } else {
      // Otherwise, decrypt the password and show it
      Axios.post("http://localhost:3001/decryptpassword", {
        password: encryption.password,
        iv: encryption.iv,
      }).then((response) => {
        // Find the index of the password to update
        const passwordIndex = passwordList.findIndex(
          (val) => val.id === encryption.id
        );

        if (passwordIndex !== -1) {
          const newPasswordList = [...passwordList];
          newPasswordList[passwordIndex] = {
            ...newPasswordList[passwordIndex],
            decrypted: response.data,
          };
          setPasswordList(newPasswordList);
          setDecryptedId(encryption.id); // Set the ID of the currently decrypted password
        }
      });
    }
  };

  return (
    <div className="App">
      <div className="AddingPassword">
        <input
          type="text"
          placeholder="Ex. Password 123"
          onChange={(event) => {
            setPasswords(event.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Ex. Facebook"
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        />
        <button onClick={addPassword}>Add Password</button>
      </div>

      <div className="PasswordList">
        <h1>Stored Passwords</h1>
        {passwordList.map((val) => {
          return (
            <div
              className="password"
              key={val.id} // Added key for better React performance
              onClick={() => {
                togglePassword({
                  password: val.password,
                  iv: val.iv,
                  id: val.id,
                });
              }}
            >
              <h3>{decryptedId === val.id ? val.decrypted : val.website}</h3>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
