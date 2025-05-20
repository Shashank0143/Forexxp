"use client"
import React, { useState, useEffect } from 'react';
import { LuShirt } from "react-icons/lu";
import { TbTruckDelivery } from "react-icons/tb";
import { RiDiscountPercentLine } from "react-icons/ri";
import { CiBadgeDollar } from "react-icons/ci";
import Link from "next/link";
import { FaFacebookF, FaShieldAlt } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import newsLetterImg from '../../assets/images/newsletter.png';
import Button from '@mui/material/Button';
import { IoMailOutline } from "react-icons/io5";
import Image from "next/image";
import GodaddyImg from "../../assets/images/godaddy.svg"
import NortonImg from "../../assets/images/norton.svg"
import SSLImg from "../../assets/images/ssl.svg"

import { MyContext } from "@/context/ThemeContext";
import PaymentImg from "../../assets/images/payment-method.png"
import { useContext } from "react";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import ProductModal from "../ProductModal";
import { fetchDataFromApi } from "@/utils/api";
import { FaBuilding, FaGift, FaLinkedin, FaPhone, FaYoutube } from 'react-icons/fa6';


const Footer = () => {

    const context = useContext(MyContext);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        context.setAlertBox({
            open: false
        });
    };


    return (
        <>

            <Snackbar open={context.alertBox.open} autoHideDuration={6000} onClose={handleClose} className="snackbar">
                <Alert
                    onClose={handleClose}
                    autoHideDuration={6000}
                    severity={context.alertBox.error === false ? "success" : 'error'}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {context.alertBox.msg}
                </Alert>
            </Snackbar>



            {
                context.isHeaderFooterShow === true &&
                <>
                            <div className="footer">
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col-lg-3 col-md-6">
                                            <div className="footer-widget">
                                                <h1>ForexXP Ratings</h1>
                                                <p>
                                                    ForexXP Ratings is a trusted source for Forex Brokers and
                                                    Exchanges reviews. We provide honest reviews and ratings based
                                                    on real traders&apos; experiences. Our team of experts has rated each
                                                    broker based on their trustworthiness, client support, and
                                                    trading conditions.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="col-lg-3 col-md-6">
                                            <div className="footer-widget">
                                                <h3 className="title">Explore ForexXP</h3>
                                                <ul>
                                                    <li><a href="product.html">Top 10 Brokers</a></li>
                                                    <li><a href="product-detail.html">Recent Brokers</a></li>
                                                    <li><a href="cart.html">XP Awards</a></li>
                                                    <li><a href="checkout.html">Events & Expos</a></li>
                                                    <li><a href="login.html">Cashback & Rewards</a></li>
                                                    <li><a href="my-account.html">Add / Manage Broker</a></li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="col-lg-3 col-md-6">
                                            <div className="footer-widget">
                                                <h3 className="title">My Account</h3>
                                                <ul>
                                                    <li><a href="product.html">My Ratings</a></li>
                                                    <li><a href="cart.html">My Brokers</a></li>
                                                    <li><a href="checkout.html">Update Profile</a></li>
                                                    <li><a href="login.html">Account Security</a></li>
                                                    <li><a href="my-account.html">My Referrals</a></li>
                                                    <li><a href="wishlist.html">Contact Support</a></li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="col-lg-3 col-md-6">
                                            <div className="footer-widget">
                                                <h3 className="title">Get in Touch</h3>
                                                <div className="contact-info">
                                                    <p><i className="fa fa-globe"></i>Envalog LLC Venture</p>
                                                    <p>
                                                        <i className="fa fa-map-marker"></i>1001 Kalispell, Montana 59901
                                                        USA
                                                    </p>
                                                    <p><i className="fa fa-envelope"></i>mail@forexxp.com</p>
                                                    <p><i className="fa fa-phone"></i>+1 (818) 337-5694</p>
                                                    {/* <div className="social">
                                                        <a href=""><i className="fa fa-twitter"><FaTwitter/></i></a>
                                                        <a href=""><i className="fa fa-facebook"><FaFacebookF/></i></a>
                                                        <a href=""><i className="fa fa-linkedin"><FaLinkedin/></i></a>
                                                        <a href=""><i className="fa fa-instagram"><FaInstagram/></i></a>
                                                        <a href=""><i className="fa fa-youtube"><FaYoutube/></i></a>
                                                    </div> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row payment">
                                        {/* <div className="col-md-6">
                                            <div className="payment-method">
                                                <p>We Accept:</p>
                                                <Image src={PaymentImg} alt='Payment Image'/>
                                            </div>
                                        </div> */}
                                        <div className="col-md-6">
                                            <div className="payment-security">
                                                <p>Secured By:</p>
                                                <Image src={GodaddyImg} alt="Payment Security" />
                                                <Image src={NortonImg} alt="Payment Security" />
                                                <Image src={SSLImg} alt="Payment Security" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>



                            <div className=" container copyright mt-3 pt-3 pb-3 d-flex">
                                <p className="mb-0">Copyright 2025 Envalog LLC, USA. All rights reserved</p>
                                <ul className="list list-inline ml-auto mb-0 socials">
                                    <li className="list-inline-item">
                                        <Link href="/"><FaFacebookF /></Link>
                                    </li>

                                    <li className="list-inline-item">
                                        <Link href="/"><FaTwitter /></Link>
                                    </li>

                                    <li className="list-inline-item">
                                        <Link href="/"><FaInstagram /></Link>
                                    </li>
                                </ul>
                            </div>

                </>
            }




            {
                context.isOpenProductModal === true && <ProductModal data={context.productData} />
            }

        </>
    )
}

export default Footer;