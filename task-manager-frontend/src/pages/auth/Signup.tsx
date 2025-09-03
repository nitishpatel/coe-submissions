import React from 'react'

const Signup = () => {
  return (
    <div>
      <div>
        <h1>Register</h1>
      </div>
      <form aria-label='signup-form'>
        <label htmlFor='email'>Email</label>
        <input type='email' id="email" name="email"/>
      </form>
    </div>
  )
}

export default Signup