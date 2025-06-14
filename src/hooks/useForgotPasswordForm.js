import { useFormik } from "formik";
import * as Yup from "yup";

export const useForgotPasswordForm = (onSubmit, t) => {
  return useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string()
        .email(t('forget_password.invalid_email'))
        .required(t('forget_password.email_required')),
    }),
    onSubmit,
  });
};