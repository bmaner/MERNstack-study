import axios from 'axios';
import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import CustomInput from '../components/CustomInput';
import { AuthContext } from '../context/AuthContext';
// import { useHistory } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [, setMe] = useContext(AuthContext);
    // const history = useHistory();

    async function loginHandler(e) {
        try {
            e.preventDefault();
            if (username.length < 3 || password.length < 6)
                throw new Error('입력하신 정보가 올바르지 않습니다.');
            const result = await axios.post('/users/login', {
                username,
                password,
            });
            setMe({
                userId: result.data.userId,
                sessionId: result.data.sessionsId,
                name: result.data.name,
            });
            // history.push('/');
            toast.success('로그인!');
        } catch (err) {
            toast.error(err.message);
        }
    }

    return (
        <div
            style={{
                marginTop: 100,
                maxWidth: 350,
                marginLeft: 'auto',
                marginRight: 'auto',
            }}
        >
            <h3>로그인</h3>
            <form onSubmit={loginHandler}>
                <CustomInput
                    label="회원이름"
                    value={username}
                    setValue={setUsername}
                />
                <CustomInput
                    label="비밀번호"
                    value={password}
                    setValue={setPassword}
                    type="password"
                />
                <button type="submit">로그인</button>
            </form>
        </div>
    );
};

export default LoginPage;
