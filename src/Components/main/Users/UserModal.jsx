import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { PulseLoader } from "react-spinners";
import userService from "../../../services/userService";

const userSchema = Yup.object().shape({
  username: Yup.string()
    .required("الاسم مطلوب")
    .matches(
      /^[\w.@+-]+$/,
      "اسم المستخدم يجب أن يحتوي على أحرف وأرقام و @/./+/-/_ فقط"
    ),
  email: Yup.string()
    .email("بريد إلكتروني غير صالح")
    .required("البريد الإلكتروني مطلوب"),
  organization: Yup.string().required("المؤسسة مطلوبة"),
  password: Yup.string().when("mode", {
    is: "create",
    then: () => Yup.string().required("كلمة المرور مطلوبة"),
    otherwise: () => Yup.string(),
  }),
});

const UserModal = ({
  show,
  onHide,
  mode,
  user,
  loading: parentLoading,
  handleRefresh,
}) => {
  const [loading, setLoading] = React.useState(false);
  const user_token = JSON.parse(sessionStorage.getItem("User"))?.access;

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      let response;
      const submitData = { ...values };
      delete submitData.mode;

      if (mode === "update" && !submitData.password) {
        delete submitData.password;
      }

      if (mode === "create") {
        response = await userService.createUser(user_token, submitData);
        handleRefresh();
      } else if (mode === "update") {
        response = await userService.updateUser(
          user_token,
          user.id,
          submitData
        );
        handleRefresh();
      } else if (mode === "delete") {
        response = await userService.deleteUser(user_token, user.id);
        handleRefresh();
      }

      if (response?.error) {
        console.error("Operation failed:", response.error);
        return;
      }

      onHide();
    } catch (error) {
      console.error("Operation failed:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };
  const isCreateMode = mode === "create";
  const isDeleteMode = mode === "delete";

  const initialValues = {
    username: user?.username || "",
    email: user?.email || "",
    organization: user?.organization || "",
    password: "",
  };

  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {isDeleteMode
                  ? "حذف المستخدم"
                  : isCreateMode
                  ? "إضافة مستخدم جديد"
                  : "تعديل المستخدم"}
              </h5>
              <button
                type="button"
                className="btn-close me-auto ms-0"
                onClick={onHide}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {isDeleteMode ? (
                <div className="text-center">
                  <p className="mb-4 fs-5">
                    هل أنت متأكد من حذف المستخدم "{user?.username}"؟
                  </p>
                  <div className="d-flex justify-content-center gap-3">
                    <button
                      className="btn btn-secondary"
                      onClick={onHide}
                      disabled={loading}
                    >
                      إلغاء
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleSubmit(user)}
                      disabled={loading}
                    >
                      {loading ? (
                        <PulseLoader color="#ffffff" size={8} />
                      ) : (
                        "تأكيد الحذف"
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <Formik
                  initialValues={initialValues}
                  validationSchema={userSchema}
                  onSubmit={handleSubmit}
                >
                  {({ errors, touched }) => (
                    <Form>
                      <div className="mb-3">
                        <label htmlFor="username" className="form-label">
                          الاسم
                        </label>
                        <Field
                          type="text"
                          id="username"
                          name="username"
                          className={`form-control ${
                            touched.username && errors.username
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                        {touched.username && errors.username && (
                          <div className="invalid-feedback">
                            {errors.username}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                          البريد الإلكتروني
                        </label>
                        <Field
                          type="email"
                          id="email"
                          name="email"
                          className={`form-control ${
                            touched.email && errors.email ? "is-invalid" : ""
                          }`}
                        />
                        {touched.email && errors.email && (
                          <div className="invalid-feedback">{errors.email}</div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="organization" className="form-label">
                          المؤسسة
                        </label>
                        <Field
                          type="text"
                          id="organization"
                          name="organization"
                          className={`form-control ${
                            touched.organization && errors.organization
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                        {touched.organization && errors.organization && (
                          <div className="invalid-feedback">
                            {errors.organization}
                          </div>
                        )}
                      </div>

                      {(isCreateMode || mode === "update") && (
                        <div className="mb-3">
                          <label htmlFor="password" className="form-label">
                            {isCreateMode
                              ? "كلمة المرور"
                              : "كلمة المرور (اتركها فارغة إذا لم ترد تغييرها)"}
                          </label>
                          <Field
                            type="password"
                            id="password"
                            name="password"
                            className={`form-control ${
                              touched.password && errors.password
                                ? "is-invalid"
                                : ""
                            }`}
                          />
                          {touched.password && errors.password && (
                            <div className="invalid-feedback">
                              {errors.password}
                            </div>
                          )}
                        </div>
                      )}

                      {/* <div className="mb-3">
                        <div className="form-check">
                          <Field
                            type="checkbox"
                            id="is_admin"
                            name="is_admin"
                            className="form-check-input"
                          />
                          <label className="form-check-label" htmlFor="is_admin">
                            مسؤول النظام
                          </label>
                        </div>
                      </div> */}

                      <div className="d-flex justify-content-end gap-2">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={onHide}
                          disabled={loading}
                        >
                          إلغاء
                        </button>
                        <button
                          type="submit"
                          className={`btn ${
                            isCreateMode ? "btn-success" : "btn-primary"
                          }`}
                          disabled={loading}
                        >
                          {loading ? (
                            <PulseLoader color="#ffffff" size={8} />
                          ) : isCreateMode ? (
                            "إضافة"
                          ) : (
                            "حفظ التغييرات"
                          )}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserModal;
