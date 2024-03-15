import { useState, useEffect } from "react";
import { socket } from "../socket";
import axios from "axios";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedUser, setSelectedUser] = useState(null); // Track selected user
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/v1/users/");

        setUsers(res.data.data);
        setSelectedUser(res.data.data?.[0]);
      } catch (error) {
        console.log(error.message);
      }
    };

    getAllUsers();
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = () => {
    const me = JSON.parse(localStorage.getItem("user"));
    console.log(selectedUser);
    socket.emit(`event:message`, {
      message: inputValue,
      rec: selectedUser._id,
      sen: me._id,
    });

    setInputValue("");
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  useEffect(() => {
    socket.connect();

    const me = JSON.parse(localStorage.getItem("user"));
    socket.on(me._id, (message) => {
      setMessages((prev) => [...prev, message]);
    });
  }, []);

  // useEffect(() => {
  //   setMessages([]);
  // }, [selectedUser]);

  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center">
      <div className="chat-container position-relative">
        <div className="row">
          <div className="col-12">
            <h4 className="text-center">
              {JSON.parse(localStorage.getItem("user")).name}
            </h4>
          </div>
          <div className="col-md-3 bg-light sidebar border">
            <h2 className="mt-4 mb-3 text-center">Users</h2>
            <ul className="list-group">
              {users.map((user) => (
                <li
                  key={user._id}
                  className={`list-group-item mb-2 ${
                    selectedUser && selectedUser._id === user._id
                      ? "active"
                      : ""
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleUserClick(user)}
                >
                  {user.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="col-md-9 border">
            <div className="container-fluid ">
              <div className="row">
                <div className="col-md-12 message-area">
                  {messages.map((message, i) => (
                    <div key={i} className={`message `}>
                      <p className={`mt-2 `}>
                        {message}{" "}
                        {/* <b>{message.id == selectedUser.id ? "(me)" : ""}</b> */}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="col-md-12 input-area">
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Type your message here..."
                      value={inputValue}
                      onChange={handleInputChange}
                    />
                    <div className="input-group-append ms-3">
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={handleSendMessage}
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
