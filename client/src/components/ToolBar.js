import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function ToolBar() {
    const [me, setMe] = useContext(AuthContext);
    // console.log(me);
    async function logoutHandler() {
        try {
            await axios.post('/users/logout');
            setMe();
            toast.success('로그아웃!');
            localStorage.removeItem('sessionId');
        } catch (err) {
            console.error(err);
            toast.error(err.message);
        }
    }
    return (
        <div>
            <Link to="/">
                <span>home</span>
            </Link>
            {me ? (
                <span
                    onClick={e => logoutHandler()}
                    style={{ float: 'right', cursor: 'pointer' }}
                >
                    로그아웃({me.name})
                </span>
            ) : (
                <>
                    <Link to="/auth/login">
                        <span style={{ float: 'right' }}>login</span>
                    </Link>
                    <Link to="/auth/register">
                        <span style={{ float: 'right', marginRight: 15 }}>
                            signup
                        </span>
                    </Link>
                </>
            )}
        </div>
    );
}

export default ToolBar;
