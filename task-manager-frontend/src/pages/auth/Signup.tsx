import React from "react";

const Signup = () => {
  return (
    <div>
      <div>
        <h1>Register</h1>
      </div>
      <form aria-label="signup-form">
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" />
        </div>
        <div>
          <label htmlFor="full-name">Full name</label>
          <input type="text" id="full-name" name="full-name" />
        </div>
      </form>
    </div>
  );
};

export default Signup;
