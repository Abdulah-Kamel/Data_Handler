import { useFormik } from "formik";
import * as Yup from "yup";

export const useLoginForm = (onSubmit) => {
  return useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("اسم المستخدم مطلوب"),
      password: Yup.string()
        .required("الباسورد مطلوب"),
    }),
    onSubmit,
  });
};