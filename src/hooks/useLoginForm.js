import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";

export const useLoginForm = (onSubmit) => {
  const { t } = useTranslation();

  return useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required(t("login.validation.username_required")),
      password: Yup.string().required(t("login.validation.password_required")),
    }),
    onSubmit,
  });
};