import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ImageList() {
    const [images, setImages] = useState([]);
    useEffect(() => {
        axios
            .get('/images')
            .then(result => setImages(result.data))
            .catch(err => console.error(err));
    }, []);
    // console.log(images);
    const imgList = images.map(image => (
        <img
            style={{ width: '100%' }}
            src={`http://localhost:5000/uploads/${image.key}`}
        />
    ));
    return (
        <div>
            <h3>Image List</h3>
            {imgList}
        </div>
    );
}

export default ImageList;
