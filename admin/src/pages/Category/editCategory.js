import React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { emphasize, styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { editData, fetchDataFromApi } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import { useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

// Breadcrumb code
const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

const EditCategory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formFields, setFormFields] = useState({
    name: "",
  });

  const [category, setCategory] = useState([]);

  let { id } = useParams();

  const history = useNavigate();
  const context = useContext(MyContext);

  useEffect(() => {
    context.setProgress(20);
    fetchDataFromApi(`/api/category/${id}`).then((res) => {
      setCategory(res?.categoryData[0]);
      setFormFields({
        name: res?.categoryData[0]?.name,
      });
      context.setProgress(100);
    });
  }, []);

  const changeInput = (e) => {
    setFormFields(() => ({
      ...formFields,
      [e.target.name]: e.target.value,
    }));
  };

  const editCat = (e) => {
    e.preventDefault();

    if (formFields.name !== "") {
      setIsLoading(true);
      editData(`/api/category/${id}`, formFields).then((res) => {
        setIsLoading(false);
        context.fetchCategory();
        history("/category");
      });
    } else {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please fill all the details",
      });
      return false;
    }
  };

  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 flex-row p-4 mt-2">
          <h5 className="mb-0">Edit Category</h5>
          <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
            <StyledBreadcrumb
              component="a"
              href="#"
              label="Dashboard"
              icon={<HomeIcon fontSize="small" />}
            />
            <StyledBreadcrumb
              component="a"
              label="Category"
              href="#"
              deleteIcon={<ExpandMoreIcon />}
            />
            <StyledBreadcrumb
              label="Edit Category"
              deleteIcon={<ExpandMoreIcon />}
            />
          </Breadcrumbs>
        </div>

        <form className="form" onSubmit={editCat}>
          <div className="row">
            <div className="col-sm-9">
              <div className="card p-4 mt-0">
                <div className="form-group">
                  <h6>Category Name</h6>
                  <input
                    type="text"
                    name="name"
                    value={formFields.name}
                    onChange={changeInput}
                  />
                </div>

                <Button type="submit" className="btn-blue btn-lg btn-big w-100">
                  {isLoading ? (
                    <CircularProgress color="inherit" className="loader" />
                  ) : (
                    "PUBLISH AND VIEW"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditCategory;