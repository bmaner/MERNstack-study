import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './UploadForm.css';
import ProgressBar from './ProgressBar';
import { ImageContext } from '../context/ImageContext';

function UploadForm() {
    const { setImages, setMyImages } = useContext(ImageContext);
    const [files, setFiles] = useState(null);

    const [previews, setPreviews] = useState([]);

    const [percent, setPercent] = useState(0);
    const [isPublic, setIsPublic] = useState(true);

    async function imageSelectHandler(e) {
        const imageFiles = e.target.files;
        setFiles(imageFiles);

        const imagePreviews = await Promise.all(
            [...imageFiles].map(async imageFile => {
                return new Promise((resolve, reject) => {
                    try {
                        const fileReader = new FileReader();
                        fileReader.readAsDataURL(imageFile);
                        fileReader.onload = e =>
                            resolve({
                                imgSrc: e.target.result,
                                fileName: imageFile.name,
                            });
                    } catch (err) {
                        reject(err);
                    }
                });
            })
        );

        console.log(imagePreviews);

        setPreviews(imagePreviews);
    }

    async function onSubmit(e) {
        e.preventDefault();
        const formData = new FormData();
        for (let file of files) {
            formData.append('image', file);
        }
        formData.append('public', isPublic);
        try {
            const res = await axios.post('/images', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: e => {
                    setPercent(Math.round((100 * e.loaded) / e.total));
                },
            });
            if (isPublic) setImages(prevData => [...res.data, ...prevData]);
            setMyImages(prevData => [...res.data, ...prevData]);
            toast.success('????????? ????????? ??????!');
            setTimeout(() => {
                setPercent(0);
                setPreviews([]);
            }, 3000);
        } catch (err) {
            toast.error(err.response.data.message);
            setPercent(0);

            // console.error(err);
        }
    }

    const previewImages = previews.map((preview, index) => (
        <img
            style={{ width: 140, height: 140, objectFit: 'cover' }}
            key={index}
            src={preview.imgSrc}
            alt=""
            className={`image-preview ${
                preview.imgSrc && 'image-preview-show'
            }`}
        ></img>
    ));

    const fileName =
        previews.length === 0
            ? '????????? ????????? ????????? ????????????.'
            : previews.reduce(
                  (previous, current) => previous + `${current.fileName},`,
                  ''
              );

    return (
        <form onSubmit={e => onSubmit(e)}>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 140px)',
                    gap: '12px',
                }}
            >
                {previewImages}
            </div>
            <ProgressBar percent={percent} />
            <div className="file-dropper">
                {fileName}
                <input
                    id="image"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={e => imageSelectHandler(e)}
                />
            </div>
            <input
                type="checkbox"
                id="public-check"
                value={!isPublic}
                onChange={() => setIsPublic(!isPublic)}
            />
            <label htmlFor="public-check">????????? </label>
            <button
                type="submit"
                style={{
                    width: '100%',
                    height: '40px',
                    borderRadius: '3px',
                    cursor: 'pointer',
                }}
            >
                ??????
            </button>
        </form>
    );
}

export default UploadForm;
