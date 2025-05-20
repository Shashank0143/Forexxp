"use client";
import banner1 from "../assets/images/banner1.jpg";
import banner2 from "../assets/images/banner2.jpg";
import Button from "@mui/material/Button";
import { IoIosArrowRoundForward } from "react-icons/io";
import React, { useContext, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import ProductItem from "@/Components/ProductItem";
import HomeCat from "@/Components/HomeCat";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "next/link";
import { MyContext } from "@/context/ThemeContext";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { fetchDataFromApi } from "@/utils/api";
import HomeBanner from "@/Components/HomeBanner";
import Image from "next/image";
import homeBannerPlaceholder from "../assets/images/homeBannerPlaceholder.jpg";
import Banners from "@/Components/banners";
import { FaShieldAlt } from "react-icons/fa";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [selectedCat, setselectedCat] = useState();
  const [filterData, setFilterData] = useState([]);
  const [homeSlides, setHomeSlides] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = React.useState(0);
  const [bannerList, setBannerList] = useState([]);
  const [randomCatProducts, setRandomCatProducts] = useState([]);
  const [homeSideBanners, setHomeSideBanners] = useState([]);
  const [homeBottomBanners, setHomeBottomBanners] = useState([]);

  const context = useContext(MyContext);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const selectCat = (cat) => {
    setselectedCat(cat);
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    setselectedCat(context.categoryData[0]?.name);

    fetchDataFromApi("/api/products/featured").then((res) => {
      setFeaturedProducts(res);
    });

    fetchDataFromApi("/api/products?page=1&perPage=8").then((res) => {
      setProductsData(res);
    });

    fetchDataFromApi("/api/homeBanner").then((res) => {
      setHomeSlides(res);
    });

    fetchDataFromApi("/api/banners").then((res) => {
      setBannerList(res);
    });

    fetchDataFromApi("/api/homeSideBanners").then((res) => {
      setHomeSideBanners(res);
    });

    fetchDataFromApi("/api/homeBottomBanners").then((res) => {
      setHomeBottomBanners(res);
    });
  }, []);

  useEffect(() => {
    if (context.categoryData[0] !== undefined) {
      setselectedCat(context.categoryData[0].name);
    }

    if (context.categoryData?.length !== 0) {
      const randomIndex = Math.floor(
        Math.random() * context.categoryData.length
      );

      fetchDataFromApi(`/api/products/catId?catId=${context.categoryData[randomIndex]?.id}` ).then((res) => {
        setRandomCatProducts({
          catName: context.categoryData[randomIndex]?.name,
          catId: context.categoryData[randomIndex]?.id,
          products: res?.products,
        });
      });
    }
  }, [context.categoryData]);

  useEffect(() => {
    if (selectedCat !== undefined) {
      setIsLoading(true);
      fetchDataFromApi(`/api/products/catName?catName=${selectedCat}`).then(
        (res) => {
          setFilterData(res.products);
          setIsLoading(false);
        }
      );
    }
  }, [selectedCat]);

  return (
    <>
      {homeSlides?.length !== 0 ? (
        <HomeBanner data={homeSlides} />
      ) : (
        <div className="container mt-1">
          <div className="homeBannerSection">
            <Image
              src={homeBannerPlaceholder}
              className="w-100"
              width={1000}
              height={500}
              style={{ height: "auto" }}
              alt="placeholder"
            />
          </div>
        </div>
      )}

      <section className="homeProducts">
        <div className="container">
          <div className="row homeProductsRow">
            <div className="col-md-3">
              <div className="sticky">
                {homeSideBanners?.length !== 0 &&
                  homeSideBanners?.map((item, index) => {
                    return (
                      <div className="banner mb-3" key={index}>
                        {item?.subCatId !== null ? (
                          <Link
                            href={`/category/subCat/${item?.subCatId}`}
                            className="box"
                          >
                            <img
                              src={item?.images[0]}
                              className="w-100 transition"
                              alt="banner img"
                            />
                          </Link>
                        ) : (
                          <Link
                            href={`/category/${item?.catId}`}
                            className="box"
                          >
                            <img
                              src={item?.images[0]}
                              className="cursor w-100 transition"
                              alt="banner img"
                            />
                          </Link>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="col-md-9 productRow">

              <div className="d-flex align-items-center mt-2">
                <div className="section-header">
                  <h3 className="">featured brokers</h3>
                  <p className="">
                    We have selected the best Forex Brokers and Exchanges for you. Each broker has been rated by our team of experts and real traders. Check the reviews and trust ratings.
                  </p>
                </div>
              </div>

              {featuredProducts?.length === 0 && (
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{ minHeight: "300px" }}
                >
                  <CircularProgress />
                </div>
              )}

              <div className="product_row w-100 mt-2">
                {context.windowWidth > 992 ? (
                  <Swiper
                    slidesPerView={4}
                    spaceBetween={0}
                    navigation={true}
                    slidesPerGroup={context.windowWidth > 992 ? 3 : 1}
                    modules={[Navigation]}
                    className="mySwiper"
                    breakpoints={{
                      300: {
                        slidesPerView: 1,
                        spaceBetween: 5,
                      },
                      400: {
                        slidesPerView: 2,
                        spaceBetween: 5,
                      },
                      600: {
                        slidesPerView: 3,
                        spaceBetween: 5,
                      },
                      750: {
                        slidesPerView: 4,
                        spaceBetween: 5,
                      },
                    }}
                  >
                    {featuredProducts?.length !== 0 &&
                      featuredProducts
                        ?.slice(0)
                        ?.reverse()
                        ?.map((item, index) => {
                          return (
                            <SwiperSlide key={index}>
                              <ProductItem item={item} />
                            </SwiperSlide>
                          );
                        })}
                    <SwiperSlide style={{ opacity: 0 }}>
                      <div className={`productItem`}></div>
                    </SwiperSlide>
                  </Swiper>
                ) : (
                  <div className="productScroller">
                    {featuredProducts?.length !== 0 &&
                      featuredProducts
                        ?.slice(0)
                        ?.reverse()
                        ?.map((item, index) => {
                          return <ProductItem item={item} key={index} />;
                        })}
                  </div>
                )}
              </div>

              {bannerList?.length !== 0 && (
                <Banners data={bannerList} col={3} />
              )}

              <div className="d-flex align-items-center mt-2">
                <div className="section-header">
                  <h3 className="">Recent Brokers</h3>
                  <p className="">
                    Newly added Forex Brokers and Exchanges. Check the reviews and trust ratings. We have selected the best Forex Brokers and Exchanges for you. Each broker has been rated by our team of experts and real traders. Check the reviews and trust ratings.
                  </p>
                </div>
              </div>

              <div className="product_row productRow2 w-100 mt-4 d-flex productScroller ml-0 mr-0">
                {productsData?.products?.length === 0 && (
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ minHeight: "300px" }}
                  >
                    <CircularProgress />
                  </div>
                )}

                {productsData?.products?.length !== 0 &&
                  productsData?.products
                    ?.slice(0)
                    .reverse()
                    .map((item, index) => {
                      return <ProductItem key={index} item={item} />;
                    })}
              </div>

            </div>
          </div>

          {bannerList?.length !== 0 && (
            <Banners data={homeBottomBanners} col={3} />
          )}
        </div>
      </section>

      <div className="feature">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-6 feature-col">
              <div className="feature-content">
                <i><FaShieldAlt /></i>
                <h2>Trust Scoring</h2>
                <p>
                  Check Trust Scores of Forex Brokers and Exchanges before you
                  invest your money.
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 feature-col">
              <div className="feature-content">
                <i className="fa fa-building"></i>
                <h2>Verified Offices</h2>
                <p>
                  Our team personally visit and verify physical office location of trusted brokers.
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 feature-col">
              <div className="feature-content">
                <i className="fa fa-gift"></i>
                <h2>Best Reward Programs</h2>
                <p>
                  Handpicked Reward Programs from Forex Brokers and Exchanges.
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 feature-col">
              <div className="feature-content">
                <i className="fa fa-phone"></i>
                <h2>Best Client Support</h2>
                <p>
                  24/7 Client Support from Forex Brokers and Exchanges. Get in
                  touch with us.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>


    </>
  );
}