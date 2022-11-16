import React, { useContext, useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik, FormikProvider, Form } from "formik";
import { Button, Grid, Link, TextField, Typography } from "@mui/material";
import { Alert } from "@mui/material";
import { Box } from "@mui/system";
import { actions } from "../../store/auth/actions";
import Loading from "../../utils/Loading";
import { ModalContext } from "../../contexts/context";

const initialState = {
  email: "",
  password: "",
};

const validationSchema = Yup.object({
  email: Yup.string().email().required("Email is required").label("Email"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Too short")
    .label("Password"),
});

const Login = (props) => {
  const [initFormData] = useState(initialState);
  const {close,openRegister} = React.useContext(ModalContext)
  const navigate = useNavigate();

  const onLoginSuccess =()=>{
    close()
    console.log(props.auth)
    navigate('/')
  } 
  const onSubmit = async (formData) => {
    props.login({...formData,onLoginSuccess});
  };
  const formik = useFormik({
    initialValues: initFormData,
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => onSubmit(values),
  });
  
  const { handleChange, handleSubmit, values, errors, touched, handleBlur } =
  formik;
  

  return props.auth.loading ? (
    <Loading />
  ) : (
    <Box width="65%" height="250px" ml="auto" mr="auto" mt="auto" mb="auto">
      <FormikProvider value={formik}>
        <Form onSubmit={handleSubmit}>
          <Grid
            container
            height="100%"
            width="100%"
            ml="auto"
            mr="auto"
            justifyContent="center"
            display="block"
          >
            <Grid mb={3} item>
              <TextField
                fullWidth
                variant="standard"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                error={errors.email && touched.email}
                helperText={errors.email && touched.email ? errors.email : null}
              />
            </Grid>
            <Grid item mb={3}>
              <TextField
                fullWidth
                variant="standard"
                name="password"
                placeholder="Password"
                type="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                error={errors.password && touched.password}
                helperText={
                  errors.password && touched.password ? errors.password : null
                }
              />
            </Grid>
            <Grid item mb={3}>
              <Button
                variant="contained"
                sx={{
                  borderRadius: 0,
                  backgroundColor: "black",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "black",
                  },
                }}
                type="submit"
                fullWidth
              >
                Login
              </Button>
              {props.auth.error?.message ? (
                 <span className="msg alert">{props.auth.error?.message}</span>
        ) : null}
             
            </Grid>
            <Grid item>
              <span>New to App?</span>&nbsp;
              <Link
                onClick={openRegister}
                underline="none"
                sx={{ fontWeight: "bold", color: "turquoise" }}
              >
                SIGN UP
              </Link>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </Box>
  );
};
const login = actions.login;
const resetError = actions.resetError;
const ConnectedLogin = connect((state) => state, { login, resetError })(Login);
export default ConnectedLogin;
