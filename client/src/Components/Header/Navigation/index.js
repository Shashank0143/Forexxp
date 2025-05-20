import Button from "@mui/material/Button";
import { IoIosMenu } from "react-icons/io";
import { FaAngleDown } from "react-icons/fa6";
import { useContext, useEffect, useState } from "react";
import { FaAngleRight } from "react-icons/fa6";
import { MyContext } from "@/context/ThemeContext";
import CountryDropdown from "@/Components/CountryDropdown";
import Link from "next/link";
import { fetchDataFromApi } from "@/utils/api";

const Navigation = (props) => {
  const [isopenSidebarVal, setisopenSidebarVal] = useState(false);
  const [isOpenNav, setIsOpenNav] = useState(false);
  const [isOpenSubMenuIndex, setIsOpenSubMenuIndex] = useState(null);
  const [isOpenSubMenu_, setIsOpenSubMenu_] = useState(false);

  const context = useContext(MyContext);

  useEffect(() => {
    setIsOpenNav(props.isOpenNav);
  }, [props.isOpenNav]);

  const IsOpenSubMenu = (index) => {
    setIsOpenSubMenuIndex(index);
    setIsOpenSubMenu_(!isOpenSubMenu_);
  };

  return (
    <nav>
      <div className="container-fluid">
        <div className="row align-items-center">

          <div
            className={`navPart2 d-flex align-items-center res-nav-wrapper ${isOpenNav === true ? "open" : "close"
              }`}
          >
            <div className="res-nav-overlay" onClick={props.closeNav}></div>

            <ul className="list list-inline res-nav">
              {context.windowWidth < 992 && (
                <>
                  {context.isLogin !== true && (
                    <li className="list-inline-item pl-3">
                      <Link href="/signIn">
                        <Button className="btn-blue btn-round mr-3">
                          Sign In
                        </Button>
                      </Link>
                    </li>
                  )}
                </>
              )}
              {
                <li className="list-inline-item" onClick={props.closeNav}>
                  <Link href="/">
                    <Button>Home</Button>
                  </Link>
                </li>
              }
              {context.isLogin === true && (
                <li className="list-inline-item" onClick={props.closeNav}>
                  <Link href="/signUpBroker">
                    <Button>Add A Broker</Button>
                  </Link>
                </li>
              )}
              {props.navData
                .filter((item, idx) => idx < 8)
                .map((item, index) => {
                  return (
                    <li key={index} className="list-inline-item">
                      <Link
                        href={`/category/${item?._id}`}
                        onClick={props.closeNav}
                      >
                        <Button>{item?.name}</Button>
                      </Link>

                      {item?.children?.length !== 0 &&
                        context.windowWidth < 992 && (
                          <span className={`arrow ${isOpenSubMenuIndex === index &&
                            isOpenSubMenu_ === true &&
                            "rotate"
                            }`}
                            onClick={() => IsOpenSubMenu(index)}
                          >
                            <FaAngleDown />
                          </span>
                        )}

                      {item?.children?.length !== 0 && (
                        <div
                          className={`submenu ${isOpenSubMenuIndex === index &&
                            isOpenSubMenu_ === true &&
                            "open"
                            }`}
                        >
                          {item?.children?.map((subCat, key) => {
                            return (
                              <Link
                                href={`/category/subCat/${subCat?._id}`}
                                key={key}
                                onClick={props.closeNav}
                              >
                                <Button>{subCat?.name}</Button>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
