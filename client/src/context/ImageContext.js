import React, {
    createContext,
    useState,
    useEffect,
    useContext,
    useCallback,
} from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
export const ImageContext = createContext();

export function ImageProvider(prop) {
    const [images, setImages] = useState([]);
    const [myImages, setMyImages] = useState([]);
    const [isPublic, setIsPublic] = useState(true);
    const [imageUrl, setImageUrl] = useState('/images');
    const [imageLoading, setImageLoading] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [me] = useContext(AuthContext);
    useEffect(() => {
        setImageLoading(true);
        axios
            .get(imageUrl)
            .then(
                result => setImages(prevData => [...prevData, ...result.data]) //([...images, ...result.datas]) -> missing dependency가 뜬다.
            )
            .catch(err => {
                console.error(err);
                setImageError(err);
            })
            .finally(() => setImageLoading(false));
    }, [imageUrl]);
    useEffect(() => {
        if (me) {
            setTimeout(() => {
                axios
                    .get('/users/me/images')
                    .then(result => setMyImages(result.data))
                    .catch(err => console.error(err));
            }, 0);
        } else {
            setMyImages([]);
            setIsPublic(true);
        }
    }, [me]);

    const lastImageId =
        images.length > 0 ? images[images.length - 1]._id : null;

    const loadMoreImages = useCallback(() => {
        if (imageLoading || !lastImageId) return;
        setImageUrl(`/images?lastId=${lastImageId}`);
    }, [lastImageId, imageLoading]); //dependency에는 객체나 배열을 넣어주기보다 boolean값을 넣어주는 것이 좋다.
    return (
        <ImageContext.Provider
            value={{
                images,
                setImages,
                myImages,
                setMyImages,
                isPublic,
                setIsPublic,
                loadMoreImages,
                imageLoading,
                imageError,
            }}
        >
            {prop.children}
        </ImageContext.Provider>
    );
}
