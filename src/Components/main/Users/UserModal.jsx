import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { PulseLoader } from "react-spinners";
import userService from "../../../services/userService";
import { useAuth } from "../../../Context/AuthContext";

const UserModal = ({
  show,
  onHide,
  mode,
  user,
  handleRefresh,
}) => {
  const { t } = useTranslation();

  const userSchema = Yup.object().shape({
    username: Yup.string()
      .required(t('users.modal.validation.username_required'))
      .matches(
        /^[^\s]+$/,
        t('users.modal.validation.username_invalid')
      ),
    email: Yup.string()
      .email(t('users.modal.validation.email_invalid'))
      .required(t('users.modal.validation.email_required')),
    organization: Yup.string().required(t('users.modal.validation.organization_required')),
    password: mode === 'create'
      ? Yup.string().required(t('users.modal.validation.password_required'))
      : Yup.string(),
  });

  const [loading, setLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState({});
  const { accessToken } = useAuth(); 

  const handleSubmit = async (values) => {
    setLoading(true);
    setApiErrors({});
    try {
      let response;
      const submitData = { ...values };
      delete submitData.mode;

      if (mode === "update" && !submitData.password) {
        delete submitData.password;
      }

      if (mode === "create") {
        response = await userService.createUser(accessToken, submitData);
        if (response.status === 201) {
          handleRefresh();
          onHide();
        }
      } else if (mode === "update") {
        response = await userService.updateUser(
          accessToken,
          user.id,
          submitData
        );
        if (response?.data?.status === 200) {
          handleRefresh();
          onHide();
        }
      } else if (mode === "delete") {
        response = await userService.deleteUser(accessToken, user.id);
        if (response?.data?.status === 204) {
          handleRefresh();
          onHide();
        }
      }
    } catch (error) {
      if (error.response?.data) {
        setApiErrors(error.response.data);
      } else {
        setApiErrors({ general: t('users.modal.errors.general') });
      }
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
                  ? t('users.modal.title_delete')
                  : isCreateMode
                  ? t('users.modal.title_create')
                  : t('users.modal.title_edit')
                }
              </h5>
              <button
                type="button"
                className="btn-close me-auto ms-0"
                onClick={onHide}
                aria-label={t('users.modal.close_button_aria')}
              ></button>
            </div>
            <div className="modal-body">
              {apiErrors.general && (
                <div className="alert alert-danger mb-3">
                  {apiErrors.general}
                </div>
              )}
              
              {isDeleteMode ? (
                <div className="text-center">
                  <p className="mb-4 fs-5">
                    {t('users.modal.delete_confirmation', { username: user?.username })}
                  </p>
                  <div className="d-flex justify-content-center gap-3">
                    <button
                      className="btn btn-secondary"
                      onClick={onHide}
                      disabled={loading}
                    >
                      {t('users.modal.buttons.cancel')}
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleSubmit(user)}
                      disabled={loading}
                    >
                      {loading ? (
                        <PulseLoader color="#ffffff" size={8} />
                      ) : (
                        t('users.modal.buttons.confirm_delete')
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
                          {t('users.modal.labels.username')}
                        </label>
                        <Field
                          type="text"
                          id="username"
                          name="username"
                          className={`form-control ${
                            (touched.username && errors.username) || apiErrors.username
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                        {((touched.username && errors.username) || apiErrors.username) && (
                          <div className="invalid-feedback">
                            {errors.username || apiErrors.username}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                          {t('users.modal.labels.email')}
                        </label>
                        <Field
                          type="email"
                          id="email"
                          name="email"
                          className={`form-control ${
                            (touched.email && errors.email) || apiErrors.email
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                        {((touched.email && errors.email) || apiErrors.email) && (
                          <div className="invalid-feedback">
                            {errors.email || apiErrors.email}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="organization" className="form-label">
                          {t('users.modal.labels.organization')}
                        </label>
                        <Field
                          type="text"
                          id="organization"
                          name="organization"
                          className={`form-control ${
                            (touched.organization && errors.organization) || apiErrors.organization
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                        {((touched.organization && errors.organization) || apiErrors.organization) && (
                          <div className="invalid-feedback">
                            {errors.organization || apiErrors.organization}
                          </div>
                        )}
                      </div>

                      {(isCreateMode || mode === "update") && (
                        <div className="mb-3">
                          <label htmlFor="password" className="form-label">
                            {isCreateMode
                              ? t('users.modal.labels.password_create')
                              : t('users.modal.labels.password_edit')
                            }
                          </label>
                          <Field
                            type="password"
                            id="password"
                            name="password"
                            className={`form-control ${
                              (touched.password && errors.password) || apiErrors.password
                                ? "is-invalid"
                                : ""
                            }`}
                          />
                          {((touched.password && errors.password) || apiErrors.password) && (
                            <div className="invalid-feedback">
                              {errors.password || apiErrors.password}
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
                          {t('users.modal.buttons.cancel')}
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
                            t('users.modal.buttons.add')
                          ) : (
                            t('users.modal.buttons.save')
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
