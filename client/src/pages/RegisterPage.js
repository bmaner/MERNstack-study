import React, { useState } from 'react';
import { toast } from 'react-toastify';
import CustomInput from '../components/CustomInput';
import axios from 'axios';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');

    async function submitHandler(e) {
        try {
            e.preventDefault();
            if (username.length < 3)
                throw new Error(
                    '회원 아이디가 너무 짧아요. 3자 이상으로 해주세요.'
                );
            if (password.length < 6)
                throw new Error(
                    '비밀번호가 너무 짧아요. 6자 이상으로 해주세요.'
                );
            if (password !== passwordCheck)
                throw new Error('비밀번호가 다릅니다. 확인해주세요.');
            const result = await axios.post('/users/register', {
                name,
                username,
                password,
            });
            console.log(result);
            toast.success('회원가입 성공!');
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
            <h3>회원가입</h3>
            <form onSubmit={submitHandler}>
                <CustomInput label="이름" value={name} setValue={setName} />
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
                <CustomInput
                    label="비밀번호 확인"
                    value={passwordCheck}
                    setValue={setPasswordCheck}
                    type="password"
                />
                <button type="submit">회원가입</button>
            </form>
        </div>
    );
};

export default RegisterPage;