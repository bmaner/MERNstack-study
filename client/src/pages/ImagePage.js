import axios from 'axios';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router';
import { AuthContext } from '../context/AuthContext';
import { ImageContext } from '../context/ImageContext';
import { toast } from 'react-toastify';

function ImagePage() {
    const { imageId } = useParams();
    const { images, setImages, setMyImages } = useContext(ImageContext);
    const [me] = useContext(AuthContext);
    const [hasLiked, setHasLiked] = useState(false);
    const [image, setImage] = useState();
    const [error, setError] = useState(false);
    const imageRef = useRef();

    useEffect(() => {
        imageRef.current = images.find(image => image._id === imageId);
    }, [images, imageId]);

    useEffect(() => {
        if (imageRef.current) setImage(imageRef.current);
        // 현재 이미지 페이지네이션을 사용하고있고, images 배열에서 선택한 이미지의 아디로 검색을 해서 사진을 나타내는데 새로고침을하면 첫번째 페이지에 나타나는 사진의 경우에는 나타남 but 그 이후의 페이지에 속하는 경우에는 나타나지 않음
        // 배열에 이미지가 존재할 때
        else
            axios
                .get(`/images/${imageId}`)
                .then(({ data }) => {
                    setError(false);
                    setImage(data);
                })
                .catch(err => {
                    setError(true);
                    toast.error(err.response.data.message);
                });
    }, [imageId]);

    useEffect(() => {
        if (me && image && image.likes.includes(me.userId)) setHasLiked(true);
    }, [me, image]);
    if (error) return <h3>Error...</h3>;
    else if (!image) return <h3>Loading...</h3>;

    function updateImage(images, image) {
        return [...images.filter(image => image._id !== imageId), image].sort(
            (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
        );
    }

    async function onSubmit() {
        const result = await axios.patch(
            `/images/${imageId}/${hasLiked ? 'unlike' : 'like'}`
        );
        if (result.data.public)
            setImages(prevData => updateImage(prevData, result.data));
        setMyImages(prevData => updateImage(prevData, result.data));
        setHasLiked(!hasLiked);
    }

    const deleteImage = images => {
        return images.filter(image => image._id !== imageId);
    };

    const deleteHandler = async () => {
        try {
            if (!window.confirm('정말 해당 이미지를 삭제하시겠습니까?')) return;
            const result = await axios.delete(`/images/${imageId}`);
            toast.success(result.data.message);
            setImages(prevData =>
                prevData.filter(image => image._id !== imageId)
            );
            setMyImages(prevData =>
                prevData.filter(image => image._id !== imageId)
            );
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div>
            <h3>Image Page - {imageId}</h3>
            <img
                style={{ width: '100%' }}
                alt={imageId}
                src={`http://localhost:5000/uploads/${image.key}`}
            />
            <span>좋아요{image.likes.length}</span>
            {me && image.user._id === me.userId && (
                <button
                    style={{ float: 'right', marginRight: 10 }}
                    onClick={deleteHandler}
                >
                    삭제
                </button>
            )}
            <button style={{ float: 'right' }} onClick={onSubmit}>
                {hasLiked ? '좋아요 취소' : '좋아요'}
            </button>
        </div>
    );
}

export default ImagePage;
