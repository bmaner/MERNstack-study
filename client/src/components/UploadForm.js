import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './UploadForm.css';
import ProgressBar from './ProgressBar';

function UploadForm() {
    const defaultFileName = '이미지 파일을 업로드 해주세요.';
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState(defaultFileName);
    const [percent, setPercent] = useState(0);

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
                onUploadProgress: e => {
                    setPercent(Math.round((100 * e.loaded) / e.total));
                },
            });
            // console.log(res);
            toast.success('이미지 업로드 성공!');
            setTimeout(() => {
                setPercent(0);
                setFileName(defaultFileName);
            }, 3000);
        } catch (err) {
            toast.error(err.message);
            setPercent(0);
            setFileName(defaultFileName);
            // console.error(err);
        }
    }

    return (
        <form onSubmit={e => onSubmit(e)}>
            <ProgressBar percent={percent} />
            <div className="file-dropper">
                {fileName}
                <input
                    id="image"
                    type="file"
                    onChange={e => imageSelectHandler(e)}
                />
            </div>
            <button
                type="submit"
                style={{
                    width: '100%',
                    height: '40px',
                    borderRadius: '3px',
                    cursor: 'pointer',
                }}
            >
                제출
            </button>
        </form>
    );
}

export default UploadForm;
