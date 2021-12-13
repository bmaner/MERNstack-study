import React from 'react';
import { Link } from 'react-router-dom';

function ToolBar() {
    return (
        <div>
            <Link to="/">
                <span>home</span>
            </Link>
            <Link to="/auth/login">
                <span style={{ float: 'right' }}>login</span>
            </Link>
            <Link to="/auth/register">
                <span style={{ float: 'right', marginRight: 15 }}>signup</span>
            </Link>
        </div>
    );
}

export default ToolBar;
