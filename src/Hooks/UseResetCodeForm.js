import { useFormik } from "formik";
import * as Yup from "yup";

export const useResetCodeForm = (onSubmit) => {
  return useFormik({
    initialValues: { resetCode: "" },
    validationSchema: Yup.object({
      resetCode: Yup.string()
        .required("كود التحقق مطلوب")
        .matches(/^\d+$/, "يجب أن يحتوي على أرقام فقط"),
    }),
    onSubmit,
  });
};