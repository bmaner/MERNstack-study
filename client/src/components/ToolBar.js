import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function ToolBar() {
    const [me, setMe] = useContext(AuthContext);
    console.log(me);
    return (
        <div>
            <Link to="/">
                <span>home</span>
            </Link>
            {me ? (
                <span style={{ float: 'right' }}>로그아웃</span>
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
