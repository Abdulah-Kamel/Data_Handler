import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { initialValues } from './validationSchemas';
import TaskForm from './TaskForm';

const TaskModal = ({
  show,
  onHide,
  mode,
  task,
  onSubmit: onSubmitProp,
  loading,
}) => {
  const { t } = useTranslation();

  const createTaskSchema = Yup.object().shape({
    url: Yup.string().url(t('content_tracker.task_modal.validation.url_invalid')).required(t('content_tracker.task_modal.validation.url_required')),
    search_sources: Yup.string().required(t('content_tracker.task_modal.validation.search_sources_required')),
    count: Yup.number()
      .min(1, t('content_tracker.task_modal.validation.count_min'))
      .max(100, t('content_tracker.task_modal.validation.count_max'))
      .required(t('content_tracker.task_modal.validation.count_required')),
    search_time: Yup.string().required(t('content_tracker.task_modal.validation.search_time_required')),
    save_to_excel: Yup.boolean(),
    is_scheduled: Yup.boolean(),
    start_date: Yup.date().when('is_scheduled', {
      is: true,
      then: () => Yup.date().required(t('content_tracker.task_modal.validation.start_date_required'))
    }),
    end_date: Yup.date().when('is_scheduled', {
      is: true,
      then: () => Yup.date().required(t('content_tracker.task_modal.validation.end_date_required'))
    }),
    schedule_days: Yup.number().when('is_scheduled', {
      is: true,
      then: () => Yup.number()
        .min(1, t('content_tracker.task_modal.validation.schedule_days_min'))
        .required(t('content_tracker.task_modal.validation.schedule_days_required'))
    }),
    interval_hours: Yup.number().when('is_scheduled', {
      is: true,
      then: () => Yup.number()
        .min(1, t('content_tracker.task_modal.validation.interval_hours_min'))
        .required(t('content_tracker.task_modal.validation.interval_hours_required'))
    })
  });

  const editTaskSchema = Yup.object().shape({
    url: Yup.string().url(t('content_tracker.task_modal.validation.url_invalid')).required(t('content_tracker.task_modal.validation.url_required')),
    title: Yup.string().required(t('content_tracker.task_modal.validation.title_required'))
  });

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
        setApiErrors({ general: t('content_tracker.task_modal.errors.unexpected') });
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
                {isCreateMode ? t('content_tracker.task_modal.create_title') : t('content_tracker.task_modal.edit_title')}
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
                initialValues={task || initialValues()}
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
