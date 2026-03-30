import React from "react";
import { useTranslation } from "react-i18next";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const ListModal = ({
  show,
  onHide,
  onSubmit,
  list,
  isEditing,
  formSubmitting,
  error,
}) => {
  const { t } = useTranslation();

  const ListSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, t("structures.list_modal.validation.name_min"))
      .max(100, t("structures.list_modal.validation.name_max"))
      .required(t("structures.list_modal.validation.name_required")),
  });

  return (
    <div
      className={`modal fade ${show ? "show" : ""}`}
      style={{ display: show ? "block" : "none" }}
      tabIndex="-1"
      aria-hidden={!show}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {isEditing
                ? t("structures.list_modal.edit_title")
                : t("structures.list_modal.add_title")}
            </h5>
            <button
              type="button"
              className="btn-close me-auto ms-0 fs-5"
              onClick={onHide}
              aria-label={t("aria.close")}
            ></button>
          </div>

          <Formik
            initialValues={
              isEditing && list ? { name: list.name } : { name: "" }
            }
            enableReinitialize
            validationSchema={ListSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="listName" className="form-label">
                      {t("structures.list_modal.name_label")}
                    </label>
                    <Field
                      type="text"
                      className={`form-control ${
                        errors.name && touched.name ? "is-invalid" : ""
                      }`}
                      id="listName"
                      name="name"
                      placeholder={t(
                        "structures.list_modal.name_placeholder"
                      )}
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>
                  {error && (
                    <div className="alert alert-danger mt-3">{error}</div>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onHide}
                  >
                    {t("structures.list_modal.cancel")}
                  </button>
                  <button
                    type="submit"
                    className="btn primary-btn"
                    disabled={isSubmitting || formSubmitting}
                  >
                    {formSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        {isEditing
                          ? t("structures.list_modal.updating")
                          : t("structures.list_modal.adding")}
                      </>
                    ) : isEditing ? (
                      t("structures.list_modal.update")
                    ) : (
                      t("structures.list_modal.add")
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ListModal;
