import React from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'formik';
import { PulseLoader } from 'react-spinners';
import { CommonFields, CreateTaskFields, } from './FormSections';

const TaskForm = ({ loading, apiErrors, onHide }) => {
  const { t } = useTranslation();

  return (
    <Form>
      {apiErrors.general && (
        <div className="alert alert-danger mb-3">
          {apiErrors.general}
        </div>
      )}

      <CommonFields apiErrors={apiErrors} />

      <>
        <CreateTaskFields apiErrors={apiErrors} />
      </>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onHide}
          disabled={loading}
        >
          {t('content_tracker.task_form.cancel_button')}
        </button>
        <button
          type="submit"
          className="btn btn-success"
          disabled={loading}
        >
          {loading ? (
            <PulseLoader color="#ffffff" size={8} />
          ) : (
            t('content_tracker.task_form.add_button')
          )}
        </button>
      </div>
    </Form>
  );
};

export default TaskForm;
