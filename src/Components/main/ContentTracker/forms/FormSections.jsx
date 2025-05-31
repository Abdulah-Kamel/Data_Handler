import React from 'react';
import FormField from './FormField';

const commonSearchOptions = [
  { value: 'both', label: 'كلاهما' },
  { value: 'google', label: 'Google' },
  { value: 'duckduckgo', label: 'DuckDuckGo' }
];

const searchTimeOptions = [
  { value: 'any', label: 'أي وقت' },
  { value: 'past_day', label: 'اليوم الماضي' },
  { value: 'past_week', label: 'الأسبوع الماضي' },
  { value: 'past_month', label: 'الشهر الماضي' },
  { value: 'past_year', label: 'السنة الماضية' }
];

export const CommonFields = ({ apiErrors }) => (
  <>
    <FormField
      name="url"
      label="رابط المقال الأصلي"
      type="url"
      apiErrors={apiErrors}
    />
  </>
);

export const CreateTaskFields = ({ apiErrors }) => (
  <>
    <div className="alert alert-info mb-4">
      <i className="fas fa-info-circle me-2"></i>
      أدخل رابط المقال الأصلي وسيتم البحث عن المواقع التي نقلت المحتوى
    </div>

    <FormField
      name="search_sources"
      label="مصادر البحث"
      type="select"
      selectOptions={commonSearchOptions}
      apiErrors={apiErrors}
    />

    <FormField
      name="count"
      label="عدد النتائج"
      type="number"
      min="1"
      max="100"
      apiErrors={apiErrors}
    />

    <FormField
      name="search_time"
      label="وقت البحث"
      type="select"
      selectOptions={searchTimeOptions}
      apiErrors={apiErrors}
    />

    <FormField
      name="save_to_excel"
      label="حفظ النتائج إلى ملف Excel"
      type="checkbox"
      className="mb-4"
      apiErrors={apiErrors}
    />
  </>
);

export const ScheduleFields = ({ apiErrors }) => (
  <div className="scheduled-fields border rounded p-3 mb-4">
    <h6 className="mb-3">إعدادات الجدولة</h6>
    
    <div className="row">
      <div className="col-md-6">
        <FormField
          name="start_date"
          label="تاريخ البدء"
          type="date"
          apiErrors={apiErrors}
        />
      </div>
      
      <div className="col-md-6">
        <FormField
          name="end_date"
          label="تاريخ الانتهاء"
          type="date"
          apiErrors={apiErrors}
        />
      </div>
    </div>

    <div className="row">
      <div className="col-md-6">
        <FormField
          name="schedule_days"
          label="عدد الأيام بين كل بحث"
          type="number"
          min="1"
          apiErrors={apiErrors}
        />
      </div>
      
      <div className="col-md-6">
        <FormField
          name="interval_hours"
          label="عدد الساعات بين كل بحث"
          type="number"
          min="1"
          apiErrors={apiErrors}
        />
      </div>
    </div>
  </div>
);

export const ScheduleToggle = ({ apiErrors }) => (
  <FormField
    name="is_scheduled"
    label="جدولة المهمة"
    type="checkbox"
    apiErrors={apiErrors}
  />
);

export const EditTaskFields = ({ apiErrors }) => (
  <FormField
    name="title"
    label="عنوان المقال"
    type="text"
    apiErrors={apiErrors}
  />
);
