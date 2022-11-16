import React, { useContext, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik, FormikProvider, Form } from "formik";
import { Button, Grid, Link, TextField, Typography } from "@mui/material";
import { Alert } from "@mui/material";
import { Box } from "@mui/system";
import { actions } from "../../store/auth/actions";
import { ModalContext } from "../../contexts/context";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

const validationSchema = Yup.object({
  userName: Yup.string()
    .required("User Name is required")
    .min(3)
    .label("UserName"),
  email: Yup.string().email().required("Email is required").label("Email"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Too short")
    .label("Password"),
  passwordConfirmation: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Passwords must match"
  ),
});

const Register = (props) => {
  const [initFormData] = useState(initialState);
  const {openLogin} = useContext(ModalContext)
  const navigate = useNavigate();

  const onRegisterSuccess =()=>{
    openLogin()
    navigate('/')
  } 

  const onSubmit = (formData) => {
    delete formData.passwordConfirmation;
    props.register({...formData,onRegisterSuccess});
  };
  const formik = useFormik({
    initialValues: initFormData,
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => onSubmit(values),
  });

  const { handleChange, handleSubmit, values, errors, touched, handleBlur } =
    formik;

  return (
    <Box width="65%" height="350px" ml="auto" mr="auto" mt="auto" mb="auto">
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
                name="userName"
                placeholder="Username"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.userName}
                error={errors.userName && touched.userName}
                helperText={
                  errors.userName && touched.userName ? errors.userName : null
                }
              />
            </Grid>
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
              <TextField
                fullWidth
                variant="standard"
                name="passwordConfirmation"
                placeholder="Confirm Password"
                type="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.passwordConfirmation || ''}
                error={
                  errors.passwordConfirmation && touched.passwordConfirmation
                }
                helperText={
                  errors.passwordConfirmation && touched.passwordConfirmation
                    ? errors.passwordConfirmation
                    : null
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
                Register
              </Button>
              {props.auth.error?.message ? (
                 <span className="msg alert">{props.auth.error?.message}</span>
        ) : null}
            </Grid>
            <Grid item>
              <span>New to App?</span>&nbsp;
              <Link
                onClick={openLogin}
                underline="none"
                sx={{ fontWeight: "bold", color: "turquoise" }}
              >
                SIGN IN
              </Link>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </Box>
  );
};
const register = actions.register;
const resetError = actions.resetError;
const ConnectedRegister = connect((state) => state, { resetError, register })(
  Register
);
export default ConnectedRegister;
