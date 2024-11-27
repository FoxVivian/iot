import React, { useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/login', { username, password });
            const token = response.data.token;

            // Lưu token vào localStorage
            Cookies.set('token', token, { expires: 1 }); // Hết hạn sau 1 ngày

            console.log('Login successful!', token);
        } catch (err) {
            setError('Invalid username or password');
            console.error(err);
        }
    };

    return (
        <div style={{
            maxWidth: '400px',
            margin: '100px auto',
            padding: '20px',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Login</h2>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="username" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Username:
                    </label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            transition: 'border 0.3s',
                        }}
                        onFocus={(e) => e.target.style.border = '1px solid #007bff'}
                        onBlur={(e) => e.target.style.border = '1px solid #ddd'}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Password:
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            transition: 'border 0.3s',
                        }}
                        onFocus={(e) => e.target.style.border = '1px solid #007bff'}
                        onBlur={(e) => e.target.style.border = '1px solid #ddd'}
                    />
                </div>
                <button type="submit" style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    transition: 'background-color 0.3s',
                }} onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'} onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}>
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
