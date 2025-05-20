"use client";
import ProductZoom from '@/Components/ProductZoom';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import { useContext, useEffect, useState } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import { MyContext } from "@/context/ThemeContext";
import { fetchDataFromApi, postData } from "@/utils/api";
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import LinkIcon from '@mui/icons-material/Link'; // Added for URL icon
import { Link } from '@mui/material'; // Added for link component

const ProductDetails = ({ params }) => {
    const [productData, setProductData] = useState(null);
    const [reviewsData, setReviewsData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [sortOrder, setSortOrder] = useState('latest');
    const [rating, setRating] = useState(1);
    const [reviews, setReviews] = useState({
        productId: "",
        customerName: "",
        customerId: "",
        review: "",
        customerRating: 0,
        website: "",
    });

    const id = params.productId;
    const context = useContext(MyContext);

    useEffect(() => {
        window.scrollTo(0, 0);
        setIsLoading(true);
        fetchDataFromApi(`/api/products/${id}`)
            .then((res) => {
                setProductData(res);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Failed to fetch product:", error);
                setIsLoading(false);
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: "Failed to load product details",
                });
            });

        fetchDataFromApi(`/api/productReviews?productId=${id}`)
            .then((res) => {
                setReviewsData(res);
            })
            .catch((error) => {
                console.error("Failed to fetch reviews:", error);
            });
    }, [id, context]);

    const onChangeInput = (e) => {
        setReviews(() => ({
            ...reviews,
            [e.target.name]: e.target.value
        }));
    };

    const changeRating = (e) => {
        setRating(e.target.value);
        reviews.customerRating = e.target.value;
    };

    const addReview = (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "Please login to submit a review",
            });
            return;
        }

        reviews.customerName = user?.name;
        reviews.customerId = user?.userId;
        reviews.productId = id;

        setIsLoading(true);
        postData("/api/productReviews/add", reviews)
            .then((res) => {
                setIsLoading(false);
                setReviews({
                    review: "",
                    customerRating: 1,
                    website: "",
                });
                setRating(1);
                fetchDataFromApi(`/api/productReviews?productId=${id}`)
                    .then((res) => {
                        setReviewsData(res);
                    })
                    .catch((error) => {
                        console.error("Failed to fetch reviews:", error);
                    });
                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: "Review submitted successfully",
                });
            })
            .catch((error) => {
                console.error("Failed to submit review:", error);
                setIsLoading(false);
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: "Failed to submit review",
                });
            });
    };

    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
        setReviewsData([...reviewsData].reverse());
    };

    const calculateOverallRating = () => {
        if (reviewsData.length === 0) return 0;
        const totalRating = reviewsData.reduce((sum, review) => sum + parseFloat(review.customerRating), 0);
        return (totalRating / reviewsData.length).toFixed(1);
    };

    return (
        <>
            {isLoading || !productData ? (
                <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ minHeight: "300px" }}
                >
                    <CircularProgress />
                </div>
            ) : (
                <section className="productDetails section">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-4 pl-5 part1">
                                <ProductZoom images={productData?.images} />
                                <div className="company-status mb-4 box-border-radius text-center shadow rounded">
                                    <h5 className="bg-dark text-white p-2 box-border-top">Company Status</h5>
                                    <div className="text-center p-3">
                                        <p className='fs-2'>Company profile not claimed</p>
                                        <p>Are you representing this company? Take control of your reviews page.</p>
                                        <Button variant="outlined" size="small">
                                            Claim {productData?.name}
                                        </Button>
                                    </div>
                                </div>

                                {productData?.website && (
                                    <div className="company-status mb-4 box-border-radius text-center shadow rounded">
                                        <h5 className="bg-dark text-white p-2 box-border-top">Register as Trader</h5>
                                        <div className="text-center p-3">
                                            <Link href={productData?.website} target="_blank" rel="noopener noreferrer">
                                                <Button variant="outlined" size="small">
                                                    Register as Trader
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="col-md-7 pl-5 pr-5 part2">
                                <div className="d-flex align-items-center">
                                    <h2 className="hd text-capitalize mb-0">
                                        {productData?.name}
                                    </h2>
                                    {productData?.website && (
                                        <Link
                                            href={productData.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ml-2"
                                            style={{ color: '#1976d2' }}
                                        >
                                            <LinkIcon fontSize="small" />
                                        </Link>
                                    )}
                                </div>
                                <div className="d-flex align-items-center mb-3">
                                    <Rating
                                        name="read-only"
                                        value={parseFloat(calculateOverallRating())}
                                        precision={0.5}
                                        readOnly
                                        size="small"
                                    />
                                    <span className="text-light ml-2">
                                        ({reviewsData?.length} Review{reviewsData?.length !== 1 ? 's' : ''})
                                    </span>
                                </div>

                                <div className="description mb-5">
                                    <h3>Description</h3>
                                    <p>{productData?.description}</p>
                                </div>

                                <div className="reviews-section">
                                    <h3>Customer Reviews</h3>
                                    <div className="review-form mb-4">
                                        <h4>Write a review about {productData?.name}</h4>
                                        <form onSubmit={addReview}>
                                            <div className="form-group d-flex align-items-center mb-3">
                                                <Rating
                                                    name="rating"
                                                    value={rating}
                                                    precision={0.5}
                                                    onChange={changeRating}
                                                />
                                            </div>
                                            <div className="form-group mb-3">
                                                <textarea
                                                    className="form-control shadow"
                                                    placeholder="Write your review here..."
                                                    name="review"
                                                    value={reviews.review}
                                                    onChange={onChangeInput}
                                                    rows="3"
                                                ></textarea>
                                            </div>
                                            <Button
                                                type="submit"
                                                className="btn-blue btn-lg btn-big btn-round"
                                                disabled={isLoading}
                                            >
                                                {isLoading ? (
                                                    <CircularProgress
                                                        color="inherit"
                                                        className="loader"
                                                    />
                                                ) : (
                                                    'Submit Review'
                                                )}
                                            </Button>
                                        </form>
                                    </div>

                                    <div className="reviews-list">
                                        <div className="d-flex align-items-center mb-3">
                                            <h4 className="mb-0">Reviews</h4>
                                            <FormControl className="ml-auto" size="small">
                                                <Select
                                                    value={sortOrder}
                                                    onChange={handleSortChange}
                                                    displayEmpty
                                                    inputProps={{ 'aria-label': 'Sort reviews' }}
                                                    style={{ fontSize: '0.9rem' }}
                                                >
                                                    <MenuItem value="latest">Latest</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </div>

                                        {reviewsData?.length === 0 ? (
                                            <p>No reviews yet.</p>
                                        ) : (
                                            reviewsData
                                                ?.slice(0)
                                                ?.reverse()
                                                ?.map((item, index) => (
                                                    <div
                                                        className="reviewBox mb-4 border-bottom"
                                                        key={index}
                                                    >
                                                        <div className="info">
                                                            <div className="d-flex align-items-center w-100">
                                                                <h5 className="mb-0">{item?.customerName}</h5>
                                                                <div className="ml-auto">
                                                                    <Rating
                                                                        name="half-rating-read"
                                                                        value={parseFloat(item?.customerRating)}
                                                                        precision={0.5}
                                                                        readOnly
                                                                        size="small"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <h6 className="text-light mt-1">{item?.dateCreated.slice(0, 10)}</h6>
                                                            <p className="mt-2">{item?.review}</p>
                                                        </div>
                                                    </div>
                                                ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </>
    );
};

export default ProductDetails;