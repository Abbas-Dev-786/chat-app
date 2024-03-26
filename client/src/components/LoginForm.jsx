import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const signInUser = async (email, password) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/v1/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("user", JSON.stringify(response.data.data.user));
      localStorage.setItem("token", JSON.stringify(response.data.data.token));
      navigate("/chat");
    } catch (error) {
      alert("Invalid credentials");
      console.error("Error during request setup:", error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    signInUser(email, password);

    // Reset form fields
    setEmail("");
    setPassword("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email address
        </label>
        <input
          type="email"
          className="form-control"
          id="email"
          placeholder="Enter email"
          value={email}
          onChange={handleEmailChange}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          type="password"
          className="form-control"
          id="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
};

export default LoginForm;
