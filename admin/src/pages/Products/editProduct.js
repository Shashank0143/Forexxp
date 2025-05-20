import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { emphasize, styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useContext, useEffect, useRef, useState } from "react";
import Rating from "@mui/material/Rating";
import { FaCloudUploadAlt } from "react-icons/fa";
import Button from "@mui/material/Button";
import {
  deleteData,
  deleteImages,
  editData,
  fetchDataFromApi,
  uploadImage,
} from "../../utils/api";
import { MyContext } from "../../App";
import CircularProgress from "@mui/material/CircularProgress";
import { FaRegImages } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IoCloseSharp } from "react-icons/io5";
import { useParams } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

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



const EditUpload = () => {
  const [categoryVal, setcategoryVal] = useState("");
  const [subCatVal, setSubCatVal] = useState("");
  const [ratingsValue, setRatingValue] = useState(1);
  const [isFeaturedValue, setisFeaturedValue] = useState("");
  const [catData, setCatData] = useState([]);
  const [subCatData, setSubCatData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [product, setProducts] = useState([]);
  const [previews, setPreviews] = useState([]);
  let { id } = useParams();
  const history = useNavigate();
  const [formFields, setFormFields] = useState({
    name: "",
    subCat: "",
    subCatName: "",
    description: "",
    brand: "",
    catName: "",
    catId: "",
    subCatId: "",
    category: "",
    rating: 0,
    isFeatured: null,
    website: "",
  });

  const context = useContext(MyContext);
  const formdata = new FormData();

  useEffect(() => {
    const subCatArr = [];
    context.catData?.categoryList?.length !== 0 &&
      context.catData?.categoryList?.map((cat, index) => {
        if (cat?.children.length !== 0) {
          cat?.children?.map((subCat) => {
            subCatArr.push(subCat);
          });
        }
      });
    setSubCatData(subCatArr);
  }, [context.catData]);

  useEffect(() => {
    window.scrollTo(0, 0);
    context.setselectedCountry("");
    setCatData(context.catData);
    fetchDataFromApi("/api/imageUpload").then((res) => {
      res?.map((item) => {
        item?.images?.map((img) => {
          deleteImages(`/api/category/deleteImage?img=${img}`).then((res) => {
            deleteData("/api/imageUpload/deleteAllImages");
          });
        });
      });
    });
    fetchDataFromApi(`/api/products/${id}`).then((res) => {
      setProducts(res);
      setFormFields({
        name: res.name || "",
        description: res.description || "",
        brand: res.brand || "",
        catName: res.catName || "",
        category: res.category?._id || "",
        catId: res.catId || "",
        subCat: res.subCat || "",
        subCatId: res.subCatId || "",
        rating: res.rating || 0,
        isFeatured: res.isFeatured || null,
        website: res.website || "",
      });
      context.setselectedCountry(res.location || "");
      setRatingValue(res.rating || 1);
      setcategoryVal(res.category?._id || "");
      setSubCatVal(res.subCatId || "");
      setisFeaturedValue(res.isFeatured || "");
      setPreviews(res.images || []);
      context.setProgress(100);
    });
  }, []);

  useEffect(() => {
    formFields.location = context.selectedCountry;
  }, [context.selectedCountry]);

  const handleChangeCategory = (event) => {
    setcategoryVal(event.target.value);
    setFormFields(() => ({
      ...formFields,
      category: event.target.value,
    }));
  };

  const handleChangeSubCategory = (event) => {
    setSubCatVal(event.target.value);
    setFormFields(() => ({
      ...formFields,
      subCatId: event.target.value,
    }));
  };

  const checkSubCatName = (subCatName) => {
    setFormFields(() => ({
      ...formFields,
      subCatName: subCatName,
    }));
  };

  const handleChangeisFeaturedValue = (event) => {
    setisFeaturedValue(event.target.value);
    setFormFields(() => ({
      ...formFields,
      isFeatured: event.target.value,
    }));
  };

  const inputChange = (e) => {
    setFormFields(() => ({
      ...formFields,
      [e.target.name]: e.target.value,
    }));
  };

  const selectCat = (cat, id) => {
    setFormFields(() => ({
      ...formFields,
      catName: cat,
      catId: id,
    }));
  };

  let img_arr = [];
  let uniqueArray = [];

  const onChangeFile = async (e, apiEndPoint) => {
    try {
      const files = e.target.files;
      setUploading(true);
      for (var i = 0; i < files.length; i++) {
        if (
          files[i] &&
          (files[i].type === "image/jpeg" ||
            files[i].type === "image/jpg" ||
            files[i].type === "image/png" ||
            files[i].type === "image/webp")
        ) {
          const file = files[i];
          formdata.append(`images`, file);
        } else {
          context.setAlertBox({
            open: true,
            error: true,
            msg: "Please select a valid JPG or PNG image file.",
          });
          return false;
        }
      }
    } catch (error) {
      console.log(error);
    }
    uploadImage(apiEndPoint, formdata).then((res) => {
      fetchDataFromApi("/api/imageUpload").then((response) => {
        if (
          response !== undefined &&
          response !== null &&
          response !== "" &&
          response.length !== 0
        ) {
          response.length !== 0 &&
            response.map((item) => {
              item?.images.length !== 0 &&
                item?.images?.map((img) => {
                  img_arr.push(img);
                });
            });
          uniqueArray = img_arr.filter(
            (item, index) => img_arr.indexOf(item) === index
          );
          setPreviews(uniqueArray);
          setTimeout(() => {
            setUploading(false);
            img_arr = [];
            context.setAlertBox({
              open: true,
              error: false,
              msg: "Images Uploaded!",
            });
          }, 500);
        }
      });
    });
  };

  const removeImg = async (index, imgUrl) => {
    const imgIndex = previews.indexOf(imgUrl);
    deleteImages(`/api/category/deleteImage?img=${imgUrl}`).then((res) => {
      context.setAlertBox({
        open: true,
        error: false,
        msg: "Image Deleted!",
      });
    });
    if (imgIndex > -1) {
      previews.splice(index, 1);
    }
  };

  const edit_Product = (e) => {
    e.preventDefault();
    const appendedArray = [...previews, ...uniqueArray];
    img_arr = [];

    // Ensure all fields are included in formFields
    const updatedFormFields = {
      ...formFields,
      images: appendedArray,
    };

    // Validate fields
    if (!formFields.name) {
      context.setAlertBox({
        open: true,
        msg: "Please add product name",
        error: true,
      });
      return false;
    }
    if (!formFields.description) {
      context.setAlertBox({
        open: true,
        msg: "Please add product description",
        error: true,
      });
      return false;
    }
    if (!formFields.brand) {
      context.setAlertBox({
        open: true,
        msg: "Please add product brand",
        error: true,
      });
      return false;
    }
    if (!formFields.category) {
      context.setAlertBox({
        open: true,
        msg: "Please select a category",
        error: true,
      });
      return false;
    }
    if (formFields.rating === 0) {
      context.setAlertBox({
        open: true,
        msg: "Please select product rating",
        error: true,
      });
      return false;
    }
    if (formFields.isFeatured === null) {
      context.setAlertBox({
        open: true,
        msg: "Please select whether the product is featured",
        error: true,
      });
      return false;
    }
    if (appendedArray.length === 0) {
      context.setAlertBox({
        open: true,
        msg: "Please select images",
        error: true,
      });
      return false;
    }

    setIsLoading(true);
    editData(`/api/products/${id}`, updatedFormFields).then((res) => {
      context.setAlertBox({
        open: true,
        msg: "The product is updated!",
        error: false,
      });
      setIsLoading(false);
      deleteData("/api/imageUpload/deleteAllImages");
      history("/products");
    }).catch((error) => {
      context.setAlertBox({
        open: true,
        msg: "Failed to update product",
        error: true,
      });
      setIsLoading(false);
      console.error("Edit product error:", error);
    });
  };

  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">Product Edit</h5>
          <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
            <StyledBreadcrumb
              component="a"
              href="#"
              label="Dashboard"
              icon={<HomeIcon fontSize="small" />}
            />
            <StyledBreadcrumb
              component="a"
              label="Products"
              href="#"
              deleteIcon={<ExpandMoreIcon />}
            />
            <StyledBreadcrumb
              label="Product Edit"
              deleteIcon={<ExpandMoreIcon />}
            />
          </Breadcrumbs>
        </div>

        <form className="form" onSubmit={edit_Product}>
          <div className="row">
            <div className="col-md-12">
              <div className="card p-4 mt-0">
                <h5 className="mb-4">Basic Information</h5>

                <div className="form-group">
                  <h6>PRODUCT NAME</h6>
                  <input
                    type="text"
                    name="name"
                    value={formFields.name}
                    onChange={inputChange}
                  />
                </div>
                <div className="form-group">
                  <h6>WEBSITE</h6>
                  <input
                    type="url"
                    name="website"
                    value={formFields.website}
                    onChange={inputChange}
                    placeholder="https://example.com"
                  />
                </div>
                <div className="form-group">
                  <h6>DESCRIPTION</h6>
                  <textarea
                    rows={5}
                    cols={10}
                    value={formFields.description}
                    name="description"
                    onChange={inputChange}
                  />
                </div>

                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <h6>CATEGORY</h6>
                      {categoryVal !== "" && (
                        <Select
                          value={categoryVal}
                          onChange={handleChangeCategory}
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                          className="w-100"
                        >
                          {context.catData?.categoryList?.length !== 0 &&
                            context.catData?.categoryList?.map((cat, index) => (
                              <MenuItem
                                className="text-capitalize"
                                value={cat._id}
                                key={index}
                                onClick={() => selectCat(cat.name, cat._id)}
                              >
                                {cat.name}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                    </div>
                  </div>

                  <div className="col">
                    <div className="form-group">
                      <h6>SUB CATEGORY</h6>
                      <Select
                        value={subCatVal}
                        onChange={handleChangeSubCategory}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                        className="w-100"
                      >
                        <MenuItem value="">
                          <em value={null}>None</em>
                        </MenuItem>
                        {subCatData?.length !== 0 &&
                          subCatData?.map((subCat, index) => (
                            <MenuItem
                              className="text-capitalize"
                              value={subCat._id}
                              key={index}
                              onClick={() => checkSubCatName(subCat.name)}
                            >
                              {subCat.name}
                            </MenuItem>
                          ))}
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <h6>BRAND</h6>
                      <input
                        type="text"
                        name="brand"
                        value={formFields.brand}
                        onChange={inputChange}
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="form-group">
                      <h6>RATINGS</h6>
                      <Rating
                        name="simple-controlled"
                        value={ratingsValue}
                        onChange={(event, newValue) => {
                          setRatingValue(newValue);
                          setFormFields(() => ({
                            ...formFields,
                            rating: newValue,
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <h6 className="text-uppercase">is Featured </h6>
                      <Select
                        value={isFeaturedValue}
                        onChange={handleChangeisFeaturedValue}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                        className="w-100"
                      >
                        <MenuItem value="">
                          <em value={null}>None</em>
                        </MenuItem>
                        <MenuItem value={true}>True</MenuItem>
                        <MenuItem value={false}>False</MenuItem>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-4 mt-0">
              <div className="imagesUploadSec">
                <h5 className="mb-4">Media And Published</h5>
                <div className="imgUploadBox d-flex align-items-center">
                  {previews?.length !== 0 &&
                    previews?.map((img, index) => (
                      <div className="uploadBox" key={index}>
                        <span
                          className="remove"
                          onClick={() => removeImg(index, img)}
                        >
                          <IoCloseSharp />
                        </span>
                        <div className="box">
                          <LazyLoadImage
                            alt={"image"}
                            effect="blur"
                            className="w-100"
                            src={img}
                          />
                        </div>
                      </div>
                    ))}
                  <div className="uploadBox">
                    {uploading === true ? (
                      <div className="progressBar text-center d-flex align-items-center justify-content-center flex-column">
                        <CircularProgress />
                        <span>Uploading...</span>
                      </div>
                    ) : (
                      <>
                        <input
                          type="file"
                          multiple
                          onChange={(e) =>
                            onChangeFile(e, "/api/category/upload")
                          }
                          name="images"
                        />
                        <div className="info">
                          <FaRegImages />
                          <h5>image upload</h5>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <br />
                <Button type="submit" className="btn-blue btn-lg btn-big w-100">
                  <FaCloudUploadAlt /> {" "}
                  {isLoading === true ? (
                    <CircularProgress color="inherit" className="loader" />
                  ) : (
                    "PUBLISH AND VIEW"
                  )}{" "}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditUpload;