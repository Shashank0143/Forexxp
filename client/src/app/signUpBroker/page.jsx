"use client";
import { useContext, useEffect, useState } from "react";
import Logo from "../../assets/images/logo.png";
import { MyContext } from "@/context/ThemeContext";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { postData } from "@/utils/api";
import { useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import Image from "next/image";
import Link from "next/link";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const SignUpForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formfields, setFormfields] = useState({
    name: "",
    position: "",
    officialemail: "",
    supportemail: "",
    personalphone: "",
    customerphone: "",
    websiteUrl: "",
    crmLoginUrl: "",
    year: "",
    availableLicenses: [],
    address: "",
  });

  const context = useContext(MyContext);
  const router = useRouter();

  const licenseOptions = [
    "FCA - UK",
    "ASIC - Australia",
    "FINMA - Switzerland",
    "ESMA - European Union",
    "FSA - Japan",
    "SCA - UAE",
    "DFSA - Dubai",
    "FSCA - South Africa",
    "HKMA - Hong kong",
    "FMA - New Zealand",
    "BaFin - Germany",
    "MAS - Singapore",
    "CySEC - CySEC",
    "BCSC - Canada",
    "OSC - Canada",
    "IIROC - Canada",
    "AMF - France",
    "Banque de France",
    "CONSOB - Italy",
    "CBR - Russia",
    "Finansinspektionen - Sweden",
    "FSC - Taiwan",
    "SC - Malaysia",
    "CMA - Saudi Arabia",
    "SEC - Philippines",
    "SEC - Nigeria",
    "SFC - Colombia",
  ];

  useEffect(() => {
    context.setisHeaderFooterShow(false);
    return () => context.setisHeaderFooterShow(true); // Cleanup on unmount
  }, [context]);

  const onchangeInput = (e) => {
    const { name, value } = e.target;
    setFormfields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLicensesChange = (event) => {
    setFormfields((prev) => ({
      ...prev,
      availableLicenses: event.target.value,
    }));
  };

  const register = async (e) => {
    e.preventDefault();
    try {
      // Client-side validation
      if (!formfields.name) {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Name cannot be blank!",
        });
        return;
      }
      if (!formfields.position) {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Position cannot be blank!",
        });
        return;
      }
      if (!formfields.officialemail) {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Official email cannot be blank!",
        });
        return;
      }
      if (!formfields.supportemail) {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Support email cannot be blank!",
        });
        return;
      }
      if (!formfields.personalphone) {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Personal phone cannot be blank!",
        });
        return;
      }
      if (!formfields.customerphone) {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Customer phone cannot be blank!",
        });
        return;
      }
      if (!formfields.websiteUrl) {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Website URL cannot be blank!",
        });
        return;
      }
      if (!formfields.crmLoginUrl) {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "CRM login URL cannot be blank!",
        });
        return;
      }
      if (!formfields.year) {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Year cannot be blank!",
        });
        return;
      }
      if (!formfields.address) {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Address cannot be blank!",
        });
        return;
      }
      if (formfields.availableLicenses.length === 0) {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "At least one license must be selected!",
        });
        return;
      }

      setIsLoading(true);

      const response = await postData("/api/broker/signup", formfields);
      if (!response.error) {
        context.setAlertBox({
          open: true,
          error: false,
          msg: "Registered successfully!",
        });
        setTimeout(() => {
          router.push("/signIn");
        }, 2000);
      } else {
        context.setAlertBox({
          open: true,
          error: true,
          msg: response.msg || "Registration failed!",
        });
      }
    } catch (error) {
      console.error("Error during registration:", error);
      context.setAlertBox({
        open: true,
        error: true,
        msg: "An error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="section signInPage signUpPageBroker">
      <div className="shape-bottom">
        <svg
          fill="#fff"
          id="Layer_1"
          x="0px"
          y="0px"
          viewBox="0 0 1921 819.8"
          style={{ enableBackground: "new 0 0 1921 819.8" }}
        >
          <path
            className="st0"
            d="M1921,413.1v406.7H0V0.5h0.4l228.1,598.3c30,74.4,80.8,130.6,152.5,168.6c107.6,57,212.1,40.7,245.7,34.4 c22.4-4.2,54.9-13.1,97.5-26.6L1921,400.5V413.1z"
          ></path>
        </svg>
      </div>

      <div className="container">
        <div className="box card p-3 shadow border-0">
          <div className="text-center">
            <Image src={Logo} alt="Logo" />
          </div>

          <form className="mt-2" onSubmit={register}>
            <h2 className="mb-3">Sign Up as Broker</h2>

            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <TextField
                    label="Full Name"
                    name="name"
                    value={formfields.name}
                    onChange={onchangeInput}
                    type="text"
                    variant="standard"
                    className="w-100"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <TextField
                    label="Position"
                    name="position"
                    value={formfields.position}
                    onChange={onchangeInput}
                    type="text"
                    variant="standard"
                    className="w-100"
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <TextField
                    label="Personal Phone No."
                    name="personalphone"
                    value={formfields.personalphone}
                    onChange={onchangeInput}
                    type="tel"
                    variant="standard"
                    className="w-100"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <TextField
                    label="Customer Phone No."
                    name="customerphone"
                    value={formfields.customerphone}
                    onChange={onchangeInput}
                    type="tel"
                    variant="standard"
                    className="w-100"
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <TextField
                label="Official Email"
                type="email"
                name="officialemail"
                value={formfields.officialemail}
                onChange={onchangeInput}
                variant="standard"
                className="w-100"
              />
            </div>
            <div className="form-group">
              <TextField
                label="Support Email"
                type="email"
                name="supportemail"
                value={formfields.supportemail}
                onChange={onchangeInput}
                variant="standard"
                className="w-100"
              />
            </div>

            <div className="form-group">
              <TextField
                label="Main Website URL"
                type="url"
                name="websiteUrl"
                value={formfields.websiteUrl}
                onChange={onchangeInput}
                variant="standard"
                className="w-100"
              />
            </div>

            <div className="form-group">
              <TextField
                label="CRM Login URL"
                type="url"
                name="crmLoginUrl"
                value={formfields.crmLoginUrl}
                onChange={onchangeInput}
                variant="standard"
                className="w-100"
              />
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <TextField
                    label="Founded in Year"
                    name="year"
                    value={formfields.year}
                    onChange={onchangeInput}
                    type="number"
                    variant="standard"
                    className="w-100"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <FormControl variant="standard" className="w-100">
                    <InputLabel id="available-licenses-label">Available Licenses</InputLabel>
                    <Select
                      labelId="available-licenses-label"
                      name="availableLicenses"
                      multiple
                      value={formfields.availableLicenses}
                      onChange={handleLicensesChange}
                      renderValue={(selected) => selected.join(", ")}
                    >
                      {licenseOptions.map((license) => (
                        <MenuItem key={license} value={license}>
                          {license}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
            </div>

            <div className="form-group">
              <TextField
                label="Address"
                name="address"
                value={formfields.address}
                onChange={onchangeInput}
                multiline
                rows={4}
                variant="standard"
                className="w-100"
              />
            </div>

            <div className="d-flex align-items-center mt-3 mb-3">
              <div className="row w-100">
                <div className="col-md-6">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="btn-blue w-100 btn-lg btn-big"
                  >
                    {isLoading ? <CircularProgress size={24} /> : "Sign Up"}
                  </Button>
                </div>
                <div className="col-md-6 pr-0">
                  <Link href="/" className="d-block w-100">
                    <Button
                      className="btn-lg btn-big w-100"
                      variant="outlined"
                      onClick={() => context.setisHeaderFooterShow(true)}
                    >
                      Cancel
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignUpForm;