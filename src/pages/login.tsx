import { useState } from "react";
import { Button, Stack, Link, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { trpc } from "../utils/trpc";
import { useNavigate } from "react-router-dom";
import { setTrpcToken } from "../providers/trpc";
const signInValidationSchema = yup.object({
  username: yup.string().required(),
  password: yup.string().required(),
});

const signUpValidationSchema = yup.object({
  username: yup
    .string()
    .required()
    .matches(/^[a-zA-Z]+$/, { message: "Only letters allowed" }),
  password: yup
    .string()
    .matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/, {
      message:
        "Password needs at least 8 characters, one uppercase, one lowercase, one number and one !@#$%^&* symbol",
    })
    .required(),
  oneTimeCode: yup
    .number()
    .required("ne Time Code is required")
    .min(1000000, "One Time Code should be between 1000000 and 9999999")
    .max(9999999, "One Time Code should be between 1000000 and 9999999"),
});

const Login = () => {
  const signInMutation = trpc.auth.signIn.useMutation();
  const signUpMutation = trpc.auth.signUp.useMutation();
  const navigate = useNavigate();

  const signInFormik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: signInValidationSchema,
    onSubmit: ({ username, password }, { setErrors }) => {
      signInMutation.mutate(
        {
          username,
          password,
        },
        {
          onError: (res) => {
            if (res.data?.httpStatus === 401) {
              setErrors({
                username: " ",
                password: res.message,
              });
            }
            if (res.data?.httpStatus === 404) {
              setErrors({
                username: res.message,
              });
            }
          },
          onSuccess: (res) => {
            setTrpcToken(res.token);
            navigate("/candidates");
          },
        }
      );
    },
  });

  const signUpFormik = useFormik({
    initialValues: {
      username: "",
      password: "",
      oneTimeCode: "",
    },
    validationSchema: signUpValidationSchema,
    onSubmit: ({ username, password, oneTimeCode }, { setErrors }) => {
      signUpMutation.mutate(
        {
          username,
          password,
          oneTimeCode: +oneTimeCode,
        },
        {
          onError: (err) => {
            if (err.data?.httpStatus === 409) {
              setErrors({ oneTimeCode: err.message });
            }
            if (err.data?.httpStatus === 400) {
              setErrors({ username: err.message });
            }
          },
          onSuccess: (res) => {
            setTrpcToken(res.token);
            navigate("/candidates");
          },
        }
      );
    },
  });

  const [signIn, setSignIn] = useState<boolean>(true);

  return (
    <Stack
      mt="30vh"
      spacing={2}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {signIn ? (
        <form onSubmit={signInFormik.handleSubmit}>
          <Stack
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TextField
              id="username"
              name="username"
              label="Username"
              value={signInFormik.values.username}
              onChange={signInFormik.handleChange}
              error={
                signInFormik.touched.username &&
                Boolean(signInFormik.errors.username)
              }
              helperText={
                signInFormik.touched.username && signInFormik.errors.username
              }
            />
            <br />
            <TextField
              id="password"
              type="password"
              label="Password"
              name="password"
              value={signInFormik.values.password}
              onChange={signInFormik.handleChange}
              error={
                signInFormik.touched.password &&
                Boolean(signInFormik.errors.password)
              }
              helperText={
                signInFormik.touched.password && signInFormik.errors.password
              }
            />
            <br />
            <Button variant="contained" color="primary" type="submit">
              Sign In
            </Button>
          </Stack>
        </form>
      ) : (
        <form onSubmit={signUpFormik.handleSubmit}>
          <Stack
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TextField
              id="username"
              name="username"
              label="Username"
              value={signUpFormik.values.username}
              onChange={signUpFormik.handleChange}
              error={
                signUpFormik.touched.username &&
                Boolean(signUpFormik.errors.username)
              }
              helperText={
                signUpFormik.touched.username && signUpFormik.errors.username
              }
            />
            <br />
            <TextField
              id="password"
              type="password"
              label="Password"
              name="password"
              value={signUpFormik.values.password}
              onChange={signUpFormik.handleChange}
              error={
                signUpFormik.touched.password &&
                Boolean(signUpFormik.errors.password)
              }
              helperText={
                signUpFormik.touched.password && signUpFormik.errors.password
              }
            />
            <br />
            <TextField
              id="oneTimeCode"
              type="oneTimeCode"
              label="One Time Code"
              name="oneTimeCode"
              value={signUpFormik.values.oneTimeCode}
              onChange={signUpFormik.handleChange}
              error={
                signUpFormik.touched.oneTimeCode &&
                Boolean(signUpFormik.errors.oneTimeCode)
              }
              helperText={
                signUpFormik.touched.oneTimeCode &&
                signUpFormik.errors.oneTimeCode
              }
            />
            <br />
            <Button variant="contained" color="primary" type="submit">
              Sign Up
            </Button>
          </Stack>
        </form>
      )}
      <Link
        component="button"
        onClick={(e) => {
          setSignIn((prevValue) => !prevValue);
          signInFormik.handleReset(e);
          signUpFormik.handleReset(e);
        }}
        mt={5}
      >
        {signIn ? "Create an account" : "Have an account"}
      </Link>
    </Stack>
  );
};

export default Login;
