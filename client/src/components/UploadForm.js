import React, { useState } from 'react';
import axios from 'axios';

function UploadForm() {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('이미지 파일을 업로드 해주세요.');

    function imageSelectHandler(e) {
        const imageFile = e.target.files[0];
        setFile(imageFile);
        // console.log(imageFile);
        setFileName(imageFile.name);
    }

    async function onSubmit(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', file);
        try {
            const res = await axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(res);
            alert('success!');
        } catch (err) {
            alert('fail!');
            console.error(err);
        }
    }

    return (
        <form onSubmit={e => onSubmit(e)}>
            <label htmlFor="image">{fileName}</label>
            <input
                id="image"
                type="file"
                onChange={e => imageSelectHandler(e)}
            />
            <button type="submit">제출</button>
        </form>
    );
}

export default UploadForm;
