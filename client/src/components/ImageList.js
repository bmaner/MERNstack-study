import React, { useContext, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ImageContext } from '../context/ImageContext';
import './ImageList.css';

function ImageList() {
    const {
        images,
        isPublic,
        setIsPublic,
        imageLoading,
        imageError,
        setImageUrl,
    } = useContext(ImageContext);
    const [me] = useContext(AuthContext);
    const elementRef = useRef(null);

    const loadMoreImages = useCallback(() => {
        if (imageLoading || images.length === 0) return;
        const lastImageId = images[images.length - 1]._id;
        setImageUrl(
            `${isPublic ? '' : '/users/me'}/images?lastId=${lastImageId}`
        );
    }, [images, imageLoading, isPublic, setImageUrl]); //dependency에는 객체나 배열을 넣어주기보다 boolean값을 넣어주는 것이 좋다.

    useEffect(() => {
        if (!elementRef.current) return; //에러처리
        const observer = new IntersectionObserver(([entry]) => {
            //observer를 설정하는 것 new IntersectionObserver는 콜백과 옵션을 인자로 받는다.
            //콜백 전달인자에는 구조분해 할당으로 entry를 뽑아서 넣어주었습니다.
            //new IntersectionObserver의 콜백함수의 전달인자로 여러개의 entry들을 넣어주면 여러 element를 주시할 수 있지만
            //저는 마지막 사진을 감싸는 Link(a)태그를 주시할 것이기에 하나만 가져왔습니다.
            if (entry.isIntersecting) loadMoreImages();
            //(참고로 옵션은 설정하지 않았기에 thresholds는 0으로 되어있습니다.)
            //그렇다면 entry.isIntersecting은 해당 요소가 화면에 보이자마자 다음 페이지의 사진을 요청하여 setImages하는 loadMoreImages 함수를 실행해주는 것이죠.
            //즉 해당 요소가 화면에 보이자마자 new IntersectionObserver의 콜백함수가 실행되는 것입니다.
            //주시할 element를 넣어주는 코드입니다.
        });
        observer.observe(elementRef.current);
        return () => observer.disconnect(); //기존에 있는 elementRef를 없애주는 역할
    }, [loadMoreImages]);

    const imgList = images.map((image, index) => (
        <Link
            key={image.key}
            to={`/images/${image._id}`}
            ref={index + 5 === images.length ? elementRef : undefined} // 마지막이 아닌 이전의 것에서 loadMoreImages 함수를 호출하고 싶다면 값을 올려줘라...
        >
            <img src={`http://localhost:5000/uploads/${image.key}`} alt="" />
        </Link>
    ));
    return (
        <div>
            <h3 style={{ display: 'inline-block', marginRight: '10' }}>
                Image List ({isPublic ? '공개' : '개인'} 사진)
            </h3>
            {me && (
                <button onClick={() => setIsPublic(!isPublic)}>
                    {isPublic ? '개인' : '공개'} 사진 보기
                </button>
            )}
            <div className="image-list-container">{imgList}</div>
            {imageError && <div>Error...</div>}
            {!imageLoading && <div>Loading...</div>}
        </div>
    );
}

export default ImageList;
