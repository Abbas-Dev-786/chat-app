import { useState, useEffect } from "react";
import { socket } from "../socket";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedUser, setSelectedUser] = useState(null); // Track selected user
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Alice Johnson" },
    { id: 4, name: "Bob Brown" },
  ]);

  // useEffect(() => {
  //   // Add some dummy messages for demonstration
  //   setMessages([
  //     { text: "Hi there!" },
  //     { text: "Hello! How can I help you?" },
  //     {
  //       text: "I'm interested in your product.",
  //     },
  //     {
  //       text: "Sure, let me provide you with some information.",
  //     },
  //   ]);
  // }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = () => {
    // if (inputValue.trim() !== "") {
    //   const newMessage = {
    //     id: messages.length + 1,
    //     text: inputValue,
    //     sender: "user", // You can customize sender, e.g., 'user' or 'bot'
    //     userId: selectedUser.id, // Assign userId to the message
    //   };

    //   setMessages([...messages, newMessage]);
    //   setInputValue("");

    // alert(inputValue);
    socket.emit("event:message", { message: inputValue });

    // socket.on("message", (message) => {
    //   setMessages((prev) => [...prev, message]);
    // });

    setInputValue("");
    // }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  // Filter messages based on the selected user
  // const filteredMessages = selectedUser
  //   ? messages.filter((message) => message.userId === selectedUser.id)
  //   : [];

  useEffect(() => {
    socket.connect();

    socket.on("message", (message) => {
      setMessages((prev) => [...prev, message]);
    });
  }, []);

  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center">
      <div className="chat-container position-relative">
        <div className="row">
          <div className="col-md-3 bg-light sidebar border">
            <h2 className="mt-4 mb-3 text-center">Users</h2>
            <ul className="list-group">
              {users.map((user) => (
                <li
                  key={user.id}
                  className={`list-group-item mb-2 ${
                    selectedUser && selectedUser.id === user.id ? "active" : ""
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
