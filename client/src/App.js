// App.js
import "./App.css";
import { useState, useEffect } from "react";
import Axios from "axios";
import PasswordPromptModal from "./PasswordPromptModal";

function App() {
  const [passwords, setPasswords] = useState("");
  const [title, setTitle] = useState("");
  const [passwordList, setPasswordList] = useState([]);
  const [decryptedId, setDecryptedId] = useState(null);

  // 🔑 States for authentication modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastAuthTime, setLastAuthTime] = useState(null);
  const [pendingEncryption, setPendingEncryption] = useState(null);

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
    const now = Date.now();

    // Require re-authentication after 30s
    if (!lastAuthTime || now - lastAuthTime > 30000) {
      setPendingEncryption(encryption);
      setIsModalOpen(true);
      return;
    }

    // Toggle password visibility
    if (decryptedId === encryption.id) {
      setDecryptedId(null);
    } else {
      Axios.post("http://localhost:3001/decryptpassword", {
        password: encryption.password,
        iv: encryption.iv,
      }).then((response) => {
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
          setDecryptedId(encryption.id);
        }
      });
    }
  };

  // Called when modal password entry is correct
  const handleAuthSuccess = () => {
    setLastAuthTime(Date.now());
    setIsModalOpen(false);

    if (pendingEncryption) {
      togglePassword(pendingEncryption);
      setPendingEncryption(null);
    }
  };

  return (
    <div className="App">
      <h1 className="AppTitle">🔐 Password Manager</h1>

      {/* Add Password Card */}
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

      {/* Stored Passwords */}
      <div className="PasswordList">
        <h1>Stored Passwords</h1>
        <div className="PasswordGrid">
          {passwordList.map((val) => (
            <div
              className="password-card"
              key={val.id}
              onClick={() => {
                togglePassword({
                  password: val.password,
                  iv: val.iv,
                  id: val.id,
                });
              }}
            >
              <div className="password-card-content">
                <span className="password-icon">🔑</span>
                <h3>{decryptedId === val.id ? val.decrypted : val.website}</h3>
                <span className="password-action">
                  {decryptedId === val.id ? "🙈 Hide" : "👁 View"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔑 Modal */}
      <PasswordPromptModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}

export default App;
