import { useFormik } from "formik";
import * as Yup from "yup";

export const useLoginForm = (onSubmit) => {
  return useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("الايميل مطلوب"),
      password: Yup.string()
        .required("الباسورد مطلوب"),
    }),
    onSubmit,
  });
};