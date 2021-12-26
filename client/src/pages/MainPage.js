import React, { useContext } from 'react';
import UploadForm from '../components/UploadForm';
import ImageList from '../components/ImageList';
import { AuthContext } from '../context/AuthContext';

const MainPage = () => {
    const [me] = useContext(AuthContext);
    return (
        <div>
            <h3>Main</h3>
            <h2>사진첩</h2>
            {me && <UploadForm />}
            <ImageList />
        </div>
    );
};

export default MainPage;
