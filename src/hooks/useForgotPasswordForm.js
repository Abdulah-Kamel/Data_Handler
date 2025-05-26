import { useFormik } from "formik";
import * as Yup from "yup";

export const useForgotPasswordForm = (onSubmit) => {
  return useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("عنوان البريد الإلكتروني غير صالح")
        .required("الايميل مطلوب"),
    }),
    onSubmit,
  });
};