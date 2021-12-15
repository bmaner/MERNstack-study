import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [me, setMe] = useState();
    return (
        <AuthContext.Provider value={[me, setMe]}>
            {children}
        </AuthContext.Provider>
    );
}
