import { useState, useEffect, useMemo } from "react";
import { socket } from "../socket";
import axios from "axios";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [file, setFile] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // Track selected user
  const [users, setUsers] = useState([]);
  const [isTyping, setTyping] = useState(false);
  const me = useMemo(() => JSON.parse(localStorage.getItem("user")), []);

  // get all users list
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

    // typing start event emitter
    socket.emit("event:typing-start", { sender: me._id });

    // typing start event
    socket.on(`typing-start:${selectedUser?._id}`, () => {
      setTyping(true);
    });
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handleFileChange = (e) => {
    const files = [...e.target.files].map(async (file) => {
      return { data: await toBase64(file), contentType: file.type };
    });

    Promise.all(files).then((values) => {
      setFile(values);
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    const data = {
      message: inputValue,
      attachments: file,
      rec: selectedUser._id,
      sen: me._id,
    };

    // message event emitter
    socket.emit(`event:message`, data);

    // typing end event emitter
    socket.emit("event:typing-end", { sender: me._id });

    // typing end event
    socket.on(`typing-end:${selectedUser?._id}`, () => {
      setTyping(false);
    });

    setInputValue("");
    setFile([]);
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  useEffect(() => {
    socket.connect();

    // message event
    socket.on(`msg:${me._id}`, (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // message error event
    socket.on("msg:err", (users) => {
      if (users.includes(me._id) || users.includes(selectedUser._id)) {
        alert("User does not exists");
      }
    });
  }, []);

  // get all stored chats
  useEffect(() => {
    const getAllChats = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/v1/chats/${selectedUser._id}`,
          {
            headers: {
              Authorization: `Bearer ${JSON.parse(
                localStorage.getItem("token")
              )}`,
            },
          }
        );

        setMessages(res.data.data);
      } catch (error) {
        console.log(error.message);
      }
    };

    selectedUser?._id && getAllChats();
  }, [selectedUser]);

  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center">
      <div className="chat-container position-relative">
        <div className="row">
          <div className="col-12">
            <h4 className="text-center">{me.name}</h4>
          </div>
          <div className="col-md-3 bg-light sidebar border">
            <h2 className="mt-4 mb-3 text-center">Users</h2>
            <ul className="list-group">
              {users
                .filter(
                  (user) =>
                    user._id != JSON.parse(localStorage.getItem("user"))._id
                )
                .map((user) => (
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
                    {user.name}{" "}
                    {user._id === selectedUser?._id && isTyping
                      ? "Typing..."
                      : ""}
                  </li>
                ))}
            </ul>
          </div>
          <div className="col-md-9 border">
            <div className="container-fluid ">
              <div className="row">
                <div
                  className="col-md-12 message-area"
                  style={{ height: "75vh" }}
                >
                  {messages?.map((message, i) => (
                    <div key={i} className={`message `}>
                      <p className={`mt-2`}>
                        {message.content}{" "}
                        <b className="ms-2">
                          {message.sender == me._id ? "(me)" : ""}
                        </b>
                        <div>
                          {message.attachments.length
                            ? message.attachments.map((attachment, i) => {
                                if (attachment.contentType.includes("image")) {
                                  return (
                                    <img
                                      key={`att-${i}`}
                                      src={attachment.data}
                                      height="100px"
                                      className="mt-2"
                                      // width="100px"
                                    />
                                  );
                                } else if (
                                  attachment.contentType.includes("pdf")
                                ) {
                                  return (
                                    <embed
                                      key={`att-${i}`}
                                      src={attachment.data}
                                      type="application/pdf"
                                      className="mt-2"
                                    />
                                  );
                                } else {
                                  const blob = new Blob([attachment.data], {
                                    type: attachment.contentType,
                                  });
                                  const url = URL.createObjectURL(blob);

                                  return (
                                    <div
                                      key={`att-${i}`}
                                      className="d-flex align-items-center justify-content-evenly mt-2"
                                    >
                                      <p>Unsupported file type</p>
                                      <a href={url} download="file">
                                        Download
                                      </a>
                                    </div>
                                  );
                                }
                              })
                            : null}{" "}
                        </div>
                      </p>
                    </div>
                  ))}
                </div>
                {selectedUser?._id && (
                  <div className="col-md-12 input-area border-top">
                    <form onSubmit={handleSendMessage}>
                      <input
                        type="file"
                        className="my-3"
                        id="inputGroupFile01"
                        multiple
                        onChange={handleFileChange}
                      />
                      <div className="input-group">
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
                            type="submit"
                            // onClick={handleSendMessage}
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
