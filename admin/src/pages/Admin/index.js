import DashboardBox from "./components/dashboardBox";
import { FaUserCircle } from "react-icons/fa";
import { IoMdCart } from "react-icons/io";
import { MdShoppingBag } from "react-icons/md";
import { GiStarsStack } from "react-icons/gi";
import { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { MyContext } from "../../App";
import "react-lazy-load-image-component/src/effects/blur.css";
import { deleteData, editData, fetchDataFromApi, updateData } from "../../utils/api";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

export const data = [
  ["Year", "Sales", "Expenses"],
  ["2013", 1000, 400],
  ["2014", 1170, 460],
  ["2015", 660, 1120],
  ["2016", 1030, 540],
];

export const options = {
  backgroundColor: "transparent",
  chartArea: { width: "100%", height: "100%" },
};

const Admin = () => {
  const [productList, setProductList] = useState([]);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState();
  const [totalOrders, setTotalOrders] = useState();
  const [totalProducts, setTotalProducts] = useState();
  const [totalProductsReviews, setTotalProductsReviews] = useState();
  const [perPage, setPerPage] = useState(10);

  const context = useContext(MyContext);

  useEffect(() => {
    context.setisHideSidebarAndHeader(false);
    window.scrollTo(0, 0);
    context.setProgress(40);
    fetchDataFromApi(`/api/products?page=1&perPage=${perPage}`).then((res) => {
      setProductList(res);
      context.setProgress(100);
    });

    fetchDataFromApi("/api/user/get/count").then((res) => {
      setTotalUsers(res.userCount);
    });

    fetchDataFromApi("/api/user").then((res) => {
      setUsers(res);
    });

    fetchDataFromApi("/api/orders/get/count").then((res) => {
      setTotalOrders(res.orderCount);
    });

    fetchDataFromApi("/api/products/get/count").then((res) => {
      setTotalProducts(res.productsCount);
    });

    fetchDataFromApi("/api/productReviews/get/count").then((res) => {
      setTotalProductsReviews(res.productsReviews);
    });
  }, []);

  const deleteUser = (id) => {
    context.setProgress(40);
    deleteData(`/api/user/${id}`).then((res) => {
      context.setProgress(100);
      context.setAlertBox({
        open: true,
        error: false,
        msg: "User Deleted!",
      });
      fetchDataFromApi("/api/user").then((res) => {
        setUsers(res);
      });
      fetchDataFromApi("/api/user/get/count").then((res) => {
        setTotalUsers(res.userCount);
      });
    });
  };

  const updateUserRole = (id, roleType, value) => {
    context.setProgress(40);
    const payload = roleType === "isAdmin" ? {isAdmin: value} : {isBroker: value};
    editData(`/api/user/${id}`, payload).then((res) => {
      context.setProgress(100);
      context.setAlertBox({
        open: true,
        error: false,
        msg: `User ${roleType === "isAdmin" ? "Admin" : "Broker"} Role Updated!`,
      });
      fetchDataFromApi("/api/user").then((res) => {
        setUsers(res);
      });
    }).catch((error) => {
      context.setAlertBox({
        open: true,
        msg: "Failed to update product",
        error: true,
      })
      console.log(error)
    });
  };

  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 p-3 mt-4">
          <h3 className="hd">User Details</h3>
          <div className="table-responsive mt-3">
            <table className="table table-bordered table-striped v-align">
              <thead className="thead-dark">
                <tr>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>ROLE(Admin)</th>
                  <th>ROLE(Broker)</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {users?.length > 0 &&
                  users.map((user, index) => (
                    <tr key={index}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <Select
                          value={user.isAdmin ? "true" : "false"}
                          onChange={(e) =>
                            updateUserRole(user.id, "isAdmin", e.target.value === "true")
                          }
                          size="small"
                          sx={{ minWidth: 100 }}
                        >
                          <MenuItem value="true">Admin</MenuItem>
                          <MenuItem value="false">User</MenuItem>
                        </Select>
                      </td>
                      <td>
                        <Select
                          value={user.isBroker ? "true" : "false"}
                          onChange={(e) =>
                            updateUserRole(user.id, "isBroker", e.target.value === "true")
                          }
                          size="small"
                          sx={{ minWidth: 100 }}
                        >
                          <MenuItem value="true">Broker</MenuItem>
                          <MenuItem value="false">User</MenuItem>
                        </Select>
                      </td>
                      <td>
                        <div className="actions d-flex align-items-center">
                          <Link to={`/user/${user.id}`}>
                            <Button className="success" color="success">
                              <FaPencilAlt />
                            </Button>
                          </Link>
                          <Button
                            className="error"
                            color="error"
                            onClick={() => deleteUser(user.id)}
                          >
                            <MdDelete />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;