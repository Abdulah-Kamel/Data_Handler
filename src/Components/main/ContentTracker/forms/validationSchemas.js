import * as Yup from 'yup';

export const createTaskSchema = Yup.object().shape({
  url: Yup.string().url("رابط غير صالح").required("الرابط مطلوب"),
  search_sources: Yup.string().required("مصادر البحث مطلوبة"),
  count: Yup.number()
    .min(1, "يجب أن يكون العدد أكبر من الصفر")
    .max(100, "الحد الأقصى للنتائج هو 100")
    .required("عدد النتائج مطلوب"),
  search_time: Yup.string().required("وقت البحث مطلوب"),
  save_to_excel: Yup.boolean(),
  is_scheduled: Yup.boolean(),
  start_date: Yup.date().when('is_scheduled', {
    is: true,
    then: () => Yup.date().required("تاريخ البدء مطلوب")
  }),
  end_date: Yup.date().when('is_scheduled', {
    is: true,
    then: () => Yup.date().required("تاريخ الانتهاء مطلوب")
  }),
  schedule_days: Yup.number().when('is_scheduled', {
    is: true,
    then: () => Yup.number()
      .min(1, "يجب أن يكون عدد الأيام أكبر من الصفر")
      .required("عدد الأيام مطلوب")
  }),
  interval_hours: Yup.number().when('is_scheduled', {
    is: true,
    then: () => Yup.number()
      .min(1, "يجب أن يكون عدد الساعات أكبر من الصفر")
      .required("عدد الساعات مطلوب")
  })
});

export const editTaskSchema = Yup.object().shape({
  url: Yup.string().url("رابط غير صالح").required("الرابط مطلوب"),
  title: Yup.string().required("العنوان مطلوب")
});

export const initialValues = (isCreateMode) => ({
  ...(isCreateMode ? {
    url: "",
    search_sources: "both",
    count: 10,
    search_time: "any",
    save_to_excel: true,
    is_scheduled: false,
    start_date: "",
    end_date: "",
    schedule_days: 1,
    interval_hours: 1
  } : {
    url: "",
    title: ""
  })
});
