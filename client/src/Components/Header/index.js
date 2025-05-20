"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Logo from "../../assets/images/logo.png";
import Button from "@mui/material/Button";
import { FiUser } from "react-icons/fi";
import SearchBox from "./SearchBox";
import Navigation from "./Navigation";
import { useContext } from "react";
import { MyContext } from "@/context/ThemeContext";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import { FaClipboardCheck } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { RiLogoutCircleRFill } from "react-icons/ri";
import { FaUserAlt } from "react-icons/fa";
import { IoMdMenu } from "react-icons/io";
import { IoIosSearch } from "react-icons/io";
import { FaAngleLeft } from "react-icons/fa6";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MdDashboard } from "react-icons/md";
import { fetchDataFromApi } from "@/utils/api";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isOpenNav, setIsOpenNav] = useState(false);
  const [isOpenSearch, setIsOpenSearch] = useState(false);
  const [Broker, setBroker] = useState(false);
  const open = Boolean(anchorEl);

  const headerRef = useRef();
  const context = useContext(MyContext);
  const history = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    fetchDataFromApi(`/api/user/${user?.userId}`).then((res) => {
      setBroker(res.isBroker)
    })
  }, []);


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    setAnchorEl(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    context.setIsLogin(false);
    history.push("/signIn");
  };

  useEffect(() => {
    window.addEventListener("scroll", () => {
      let position = window.pageYOffset;
      if (headerRef.current) {
        if (position > 100) {
          headerRef.current.classList.add("fixed");
        } else {
          headerRef.current.classList.remove("fixed");
        }
      }
    });
  }, []);

  const openNav = () => {
    setIsOpenNav(!isOpenNav);
    context.setIsOpenNav(true);
  };

  const closeNav = () => {
    setIsOpenNav(false);
    context.setIsOpenNav(false);
  };

  const openSearch = () => {
    setIsOpenSearch(!isOpenSearch);
  };

  const closeSearch = () => {
    setIsOpenSearch(false);
  };

  return (
    <>
      {context.isHeaderFooterShow === true && (
        <div className="headerWrapperFixed" ref={headerRef}>
          <div className="headerWrapper">
            <header className="header">
              <div className="container">
                <div className="row">
                  <div className="logoWrapper d-flex align-items-center col-sm-2">
                    <Link href={"/"}>
                      <Image src={Logo} alt="Logo" height={50} width={100} />
                    </Link>
                  </div>

                  <div className="col-sm-10 d-flex align-items-center part2">
                    <div
                      className={`headerSearchWrapper ${isOpenSearch === true && "open"
                        }`}
                    >
                      <div className="d-flex align-items-center">
                        <span
                          className="closeSearch mr-3"
                          onClick={() => setIsOpenSearch(false)}
                        >
                          <FaAngleLeft />
                        </span>
                        <SearchBox closeSearch={closeSearch} />
                      </div>
                    </div>

                    <div className="part3 d-flex align-items-center ml-auto">
                      {context.windowWidth < 992 && (
                        <Button
                          className="circle ml-3 toggleNav"
                          onClick={openSearch}
                        >
                          <IoIosSearch />
                        </Button>
                      )}

                      {context.isLogin !== true && context.windowWidth > 992 && (
                        <Link href="/signIn">
                          <Button className="btn-blue btn-round mr-3">
                            Sign In
                          </Button>
                        </Link>
                      )}

                      {context.isLogin === true && (
                        <>
                          <Button className="circle mr-3" onClick={handleClick}>
                            <FiUser />
                          </Button>
                          <Menu
                            anchorEl={anchorEl}
                            id="accDrop"
                            open={open}
                            onClose={handleClose}
                            onClick={handleClose}
                            transformOrigin={{
                              horizontal: "right",
                              vertical: "top",
                            }}
                            anchorOrigin={{
                              horizontal: "right",
                              vertical: "bottom",
                            }}
                          >
                            <Link href="/myAccount">
                              <MenuItem onClick={handleClose}>
                                <ListItemIcon>
                                  <FaUserAlt fontSize="small" />
                                </ListItemIcon>
                                My Account
                              </MenuItem>
                            </Link>
                            <Link href="/orders">
                              <MenuItem onClick={handleClose}>
                                <ListItemIcon>
                                  <FaClipboardCheck fontSize="small" />
                                </ListItemIcon>
                                Orders
                              </MenuItem>
                            </Link>
                            <Link href="/myList">
                              <MenuItem onClick={handleClose}>
                                <ListItemIcon>
                                  <FaHeart fontSize="small" />
                                </ListItemIcon>
                                My List
                              </MenuItem>
                            </Link>
                            {Broker && (<Link href="/brokerDashboard">
                              <MenuItem onClick={handleClose}>
                                <ListItemIcon>
                                  <MdDashboard fontSize="small" />
                                </ListItemIcon>
                                Dashboard
                              </MenuItem>
                            </Link>)}
                            <MenuItem onClick={logout}>
                              <ListItemIcon>
                                <RiLogoutCircleRFill fontSize="small" />
                              </ListItemIcon>
                              Logout
                            </MenuItem>
                          </Menu>
                        </>
                      )}

                      {context.windowWidth < 992 && (
                        <Button
                          className="circle ml-3 toggleNav"
                          onClick={openNav}
                        >
                          <IoMdMenu />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {context.categoryData?.length !== 0 && (
              <Navigation
                navData={context.categoryData}
                isOpenNav={isOpenNav}
                closeNav={closeNav}
                broker={Broker}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;