import React from 'react';

function CustomInput({ label, value, setValue, type = 'text' }) {
    return (
        <div>
            <label>{label}</label>
            <input
                style={{ width: '100%' }}
                value={value}
                onChange={e => setValue(e.target.value)}
                type={type}
            />
        </div>
    );
}

export default CustomInput;
