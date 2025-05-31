import React, { useState } from 'react';
import { Formik } from 'formik';
import { createTaskSchema, editTaskSchema, initialValues } from './validationSchemas';
import TaskForm from './TaskForm';

const TaskModal = ({
  show,
  onHide,
  mode,
  task,
  onSubmit: onSubmitProp,
  loading,
}) => {
  const [apiErrors, setApiErrors] = useState({});
  const isCreateMode = mode === 'create';

  const handleSubmit = async (values) => {
    setApiErrors({});
    try {
      // If not in create mode, submit as is
      if (!isCreateMode) {
        await onSubmitProp(values);
        return;
      }
      
      // In create mode, handle schedule fields based on is_scheduled
      const { is_scheduled, start_date, end_date, schedule_days, interval_hours, ...rest } = values;
      
      // Prepare base submission data
      const submissionData = { ...rest };
      
      // Only include schedule-related fields if task is scheduled
      if (is_scheduled) {
        Object.assign(submissionData, {
          is_scheduled: true,
          start_date,
          end_date,
          schedule_days,
          interval_hours
        });
      }
      
      await onSubmitProp(submissionData);
    } catch (error) {
      if (error.response?.data) {
        setApiErrors(error.response.data);
      } else {
        setApiErrors({ general: 'حدث خطأ غير متوقع' });
      }
    }
  };

  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header primary-bg text-white">
              <h5 className="modal-title">
                {isCreateMode ? 'إضافة مهمة جديدة' : 'تعديل المهمة'}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white me-auto ms-0"
                onClick={onHide}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <Formik
                initialValues={task || initialValues(isCreateMode)}
                validationSchema={isCreateMode ? createTaskSchema : editTaskSchema}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {(formikProps) => (
                  <TaskForm
                    {...formikProps}
                    isCreateMode={isCreateMode}
                    loading={loading}
                    apiErrors={apiErrors}
                    onHide={onHide}
                  />
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskModal;
