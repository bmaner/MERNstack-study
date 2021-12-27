import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [me, setMe] = useState();

    useEffect(() => {
        const sessionId = localStorage.getItem('sessionId');
        console.log(sessionId);
        if (me) {
            console.log('미에는 안들어오니?');
            axios.defaults.headers.common.sessionid = me.sessionId;
            localStorage.setItem('sessionId', me.sessionId);
        } else if (sessionId) {
            console.log(sessionId);
            axios
                .get('/users/me', { headers: { sessionid: sessionId } })
                .then(result => {
                    console.log('sessionid로 요청을 보낸 결과', result);
                    setMe({
                        name: result.data.name,
                        userId: result.data.userId,
                        sessionId: result.data.sessionsId,
                    });
                })
                .catch(err => {
                    console.error(err);
                    localStorage.removeItem('sessionId');
                    delete axios.defaults.headers.common.sessionid;
                });
        } else {
            delete axios.defaults.headers.common.sessionid;
        }
    }, [me]);

    return (
        <AuthContext.Provider value={[me, setMe]}>
            {children}
        </AuthContext.Provider>
    );
}
