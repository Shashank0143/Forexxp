"use client"
import Rating from '@mui/material/Rating';
import { TfiFullscreen } from "react-icons/tfi";
import Button from '@mui/material/Button';
import { IoMdHeartEmpty } from "react-icons/io";
import { useContext, useEffect, useRef, useState } from 'react';
import { MyContext } from '@/context/ThemeContext';
import Link from 'next/link';
import Slider from "react-slick";
import Skeleton from '@mui/material/Skeleton';
import { IoIosImages } from "react-icons/io";
import { FaHeart } from "react-icons/fa";
import { fetchDataFromApi, postData } from '@/utils/api';

const ProductItem = (props) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddedToMyList, setIsAddedToMyList] = useState(false);

    const context = useContext(MyContext);
    const sliderRef = useRef();

    var settings = {
        dots: true,
        infinite: true,
        loop: true,
        speed: 200,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: 100
    };

    const viewProductDetails = (id) => {
        context.openProductDetailsModal(id, true);
    }

    const handleMouseEnter = (id) => {
        if (isLoading === false) {
            setIsHovered(true);
            setTimeout(() => {
                if (sliderRef.current) {
                    sliderRef.current.slickPlay();
                }
            }, 20);
        }

        const user = JSON.parse(localStorage.getItem("user"));

        fetchDataFromApi(`/api/my-list?productId=${id}&userId=${user?.userId}`).then((res) => {
            if (res.length !== 0) {
                setIsAddedToMyList(true);
            }
        });
    }

    const handleMouseLeave = () => {
        if (isLoading === false) {
            setIsHovered(false);
            setTimeout(() => {
                if (sliderRef.current) {
                    sliderRef.current.slickPause();
                }
            }, 20);
        }
    }

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    }, []);

    const addToMyList = (id) => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user !== undefined && user !== null && user !== "") {
            const data = {
                productTitle: props?.item?.name,
                image: props.item?.images[0],
                rating: props?.item?.rating,
                price: props?.item?.price,
                productId: id,
                userId: user?.userId
            }
            postData(`/api/my-list/add/`, data).then((res) => {
                if (res.status !== false) {
                    context.setAlertBox({
                        open: true,
                        error: false,
                        msg: "The product added in my list"
                    });

                    fetchDataFromApi(`/api/my-list?productId=${id}&userId=${user?.userId}`).then((res) => {
                        if (res.length !== 0) {
                            setIsAddedToMyList(true);
                        }
                    });
                } else {
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: res.msg
                    });
                }
            });
        } else {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "Please Login to continue"
            });
        }
    }

    return (
        <>
            <style jsx>{`
                .info .description {
                    margin: 0;
                    color: #666;
                    font-size: 14px;
                    line-height: 1.4;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                }

                @media (max-width: 768px) {
                    .info .description {
                        font-size: 12px;
                        -webkit-line-clamp: 3;
                    }
                }

                .info .viewDetailsBtn {
                    margin-top: 8px;
                    display: block;
                    width: 100%;
                    text-align: center;
                }

                @media (max-width: 768px) {
                    .info .viewDetailsBtn {
                        font-size: 12px;
                        padding: 4px 6px;
                    }
                }
            `}</style>

            <div className={`productItem ${props.itemView}`}
                onMouseEnter={() => handleMouseEnter(props?.itemView === 'recentlyView' ? props.item?.prodId : props.item?.id)}
                onMouseLeave={handleMouseLeave}>
                <div className="img_rapper">
                    <Link href={`/business/${props?.itemView === 'recentlyView' ? props.item?.prodId : props.item?.id}`}>
                        {isLoading === true ? (
                            <Skeleton variant="rectangular" width={300} height={400}>
                                <IoIosImages />
                            </Skeleton>
                        ) : (
                            <img src={props.item?.images[0]} className="w-100" alt={props.item?.name} />
                        )}
                    </Link>
                    <div className="actions">
                        <Button
                            className={isAddedToMyList === true ? 'active' : ''}
                            onClick={() => addToMyList(props?.itemView === 'recentlyView' ? props.item?.prodId : props.item?.id)}
                        >
                            {isAddedToMyList === true ? (
                                <FaHeart style={{ fontSize: '20px' }} />
                            ) : (
                                <IoMdHeartEmpty style={{ fontSize: '20px' }} />
                            )}
                        </Button>
                    </div>
                </div>

                <div className="info">
                    <Link href={`/business/${props?.itemView === 'recentlyView' ? props.item?.prodId : props.item?.slug}`}>
                        <h4>{props?.item?.name?.substr(0, 30) + '...'}</h4>
                    </Link>
                    <p className="description">
                        {props?.item?.description?.substr(0, 60) + (props?.item?.description?.length > 60 ? '...' : '')}
                    </p>
                    <Rating
                        className="mt-2 mb-2"
                        name="read-only"
                        value={props?.item?.rating}
                        readOnly
                        size="small"
                        precision={0.5}
                    />
                    <div className='d-flex'>
                        <Link href={`/business/${props?.itemView === 'recentlyView' ? props.item?.prodId : props.item?.slug}`}>
                            <Button
                                variant="contained"
                                className="viewDetailsBtn"
                                style={{
                                    backgroundColor: '#1976d2',
                                    color: '#fff',
                                    fontSize: '12px',
                                    padding: '4px 8px',
                                    textTransform: 'none'
                                }}
                            >
                                View Details
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductItem