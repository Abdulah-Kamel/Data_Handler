import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import FormField from './FormField';

const getCommonSearchOptions = (t) => [
  { value: 'both', label: t('content_tracker.form_sections.search_options.both') },
  { value: 'google', label: 'Google' },
  { value: 'duckduckgo', label: 'DuckDuckGo' }
];

const getSearchTimeOptions = (t) => [
  { value: 'any', label: t('content_tracker.form_sections.time_options.any') },
  { value: 'past_day', label: t('content_tracker.form_sections.time_options.past_day') },
  { value: 'past_week', label: t('content_tracker.form_sections.time_options.past_week') },
  { value: 'past_month', label: t('content_tracker.form_sections.time_options.past_month') },
  { value: 'past_year', label: t('content_tracker.form_sections.time_options.past_year') }
];



export const CommonFields = ({ apiErrors }) => {
  const { t } = useTranslation();
  const { values } = useFormikContext();

  return (
    <>
      <FormField
        name="url"
        label={t("content_tracker.form_sections.common.original_article_url")}
        type="url"
        apiErrors={apiErrors}
      />
      <div className="alert alert-info mb-4">
        <i className="fas fa-info-circle me-2"></i>
        {t("content_tracker.form_sections.create.info_alert")}
      </div>
      <FormField
        name="optional_keywords"
        label={t("content_tracker.form_sections.common.optional_keywords")}
        type="textarea"
        apiErrors={apiErrors}
      />
      <div className="alert alert-info mb-4">
        <i className="fas fa-info-circle me-2"></i>
        {t("content_tracker.form_sections.create.keywords_info_alert")}
      </div>
    </>
  );
};

export const CreateTaskFields = ({ apiErrors }) => {
  const { t } = useTranslation();
  const commonSearchOptions = getCommonSearchOptions(t);
  const searchTimeOptions = getSearchTimeOptions(t);

  return (
    <>
      <FormField
        name="search_sources"
        label={t("content_tracker.form_sections.create.search_sources")}
        type="select"
        selectOptions={commonSearchOptions}
        apiErrors={apiErrors}
      />

      <FormField
        name="count"
        label={t("content_tracker.form_sections.create.results_count")}
        type="number"
        min="1"
        max="100"
        apiErrors={apiErrors}
      />

      <FormField
        name="search_time"
        label={t("content_tracker.form_sections.create.search_time")}
        type="select"
        selectOptions={searchTimeOptions}
        apiErrors={apiErrors}
      />

      <FormField
        name="precise_search"
        label={t("content_tracker.form_sections.common.precise_search")}
        type="checkbox"
        apiErrors={apiErrors}
      />

      <FormField
        name="save_to_excel"
        label={t("content_tracker.form_sections.create.save_to_excel")}
        type="checkbox"
        className="mb-4"
        apiErrors={apiErrors}
      />
    </>
  );
};

export const ScheduleFields = ({ apiErrors }) => {
  const { t } = useTranslation();
  return (
    <div className="scheduled-fields border rounded p-3 mb-4">
      <h6 className="mb-3">
        {t("content_tracker.form_sections.schedule.settings_title")}
      </h6>
      <div className="row">
        <div className="col-md-6">
          <FormField
            name="schedule_days"
            label={t(
              "content_tracker.form_sections.schedule.days_between_searches"
            )}
            type="number"
            min="1"
            apiErrors={apiErrors}
          />
        </div>

        <div className="col-md-6">
          <FormField
            name="interval_hours"
            label={t(
              "content_tracker.form_sections.schedule.hours_between_searches"
            )}
            type="number"
            min="1"
            apiErrors={apiErrors}
          />
        </div>
      </div>
    </div>
  );
};

export const ScheduleToggle = ({ apiErrors }) => {
  const { t } = useTranslation();
  return (
    <FormField
      name="is_scheduled"
      label={t('content_tracker.form_sections.schedule_toggle.label')}
      type="checkbox"
      apiErrors={apiErrors}
    />
  );
};

export const EditTaskFields = ({ apiErrors }) => {
  const { t } = useTranslation();
  return (
    <FormField
      name="title"
      label={t('content_tracker.form_sections.edit.article_title')}
      type="text"
      apiErrors={apiErrors}
    />
  );
};
