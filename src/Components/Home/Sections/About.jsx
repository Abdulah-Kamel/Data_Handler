import React from "react";
import invite from "../../../assets/invite.svg";

const About = () => {
  return (
    <section className="container my-5">
      <div className="row gy-5 align-items-center justify-content-center">
        <div className="col-lg-6">
          <img src={invite} alt="mobile email invite illustration" />
        </div>
        <div className="col-lg-6">
          <h4 className="text-success fw-bold align-self-start fs-2">من نحن</h4>
          <p className="mb-0" style={{ fontSize: "1.1rem" }}>
            تقدم خدمة Data Handler  الرائدة في مجال الاتصالات
            الرقمية ومقرها لندن، للشركات إمكانية إرسال رسائل SMS باستخدام هويات
            مرسلة مخصصة، مما يعزز الاحترافية والثقة. تدعم الخدمة الرسائل الفردية
            والجماعية، مما يتيح إرسال إشعارات مستهدفة أو حملات واسعة النطاق.
            يمكن التكامل عبر واجهات برمجة التطبيقات (APIs) مع أدوات مثل أنظمة
            إدارة العلاقات مع العملاء (CRMs) ومنصات التجارة الإلكترونية لأتمتة
            وتخصيص الاتصالات. تشمل الميزات الرئيسية:
            <br />
            <br />
            • المراسلة المرنة: تدعم الرسائل المستهدفة والجماعية
            <br />
            <br />
            • التكامل مع واجهات برمجة التطبيقات: يتصل مع الأنظمة الداخلية
            للأتمتة
            <br />
            <br />
            • أرشيف الرسائل: يتتبع عمليات التسليم، يحلل الحملات ويضمن تحسين
            الأداء
            <br />
            <br />
            هذا الحل المبتكر يمكن الشركات من التواصل بشكل آمن، فعال واحترافي.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
