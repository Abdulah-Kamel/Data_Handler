import React from 'react';
import { Form, useFormikContext } from 'formik';
import { PulseLoader } from 'react-spinners';
import { CommonFields, CreateTaskFields, ScheduleFields, ScheduleToggle, EditTaskFields } from './FormSections';

const TaskForm = ({ isCreateMode, loading, apiErrors, onHide }) => {
  const { values } = useFormikContext();
  
  return (
    <Form>
      {apiErrors.general && (
        <div className="alert alert-danger mb-3">
          {apiErrors.general}
        </div>
      )}

      <CommonFields apiErrors={apiErrors} />

      {isCreateMode ? (
        <>
          <CreateTaskFields apiErrors={apiErrors} />
          <ScheduleToggle apiErrors={apiErrors} />
          {values.is_scheduled && <ScheduleFields apiErrors={apiErrors} />}
        </>
      ) : (
        <EditTaskFields apiErrors={apiErrors} />
      )}

      <div className="d-flex justify-content-end gap-2 mt-4">
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
          className={`btn ${isCreateMode ? 'btn-success' : 'btn-primary'}`}
          disabled={loading}
        >
          {loading ? (
            <PulseLoader color="#ffffff" size={8} />
          ) : isCreateMode ? (
            'إضافة'
          ) : (
            'حفظ التغييرات'
          )}
        </button>
      </div>
    </Form>
  );
};

export default TaskForm;
