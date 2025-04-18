import React from "react";
import email from "../assets/email.svg";
import invite from "../assets/invite.svg";

const Home = () => {
  return (
    <div style={{ fontFamily: "Cairo, sans-serif", direction: "rtl" }}>
      {/* Header */}
      <header className="border-bottom shadow">
        <div className="container d-flex justify-content-between align-items-center p-3 flex-row-reverse">
          <button className="btn btn-success px-4 fs-5">ابدأ الان</button>
          <nav className="d-flex flex-row-reverse gap-3">
            <a href="#" className="text-decoration-none text-dark fs-4">
              اتصل بنا
            </a>
            <a href="#" className="text-decoration-none text-dark fs-4">
              من نحن
            </a>
            <a href="#" className="text-decoration-none text-dark fs-4">
              الخدمات
            </a>
            <a href="#" className="text-decoration-none text-dark fs-4">
              الرئيسية
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className=" text-center my-5 min-vh-100 "
        style={{ backgroundColor: "#f8f9fa" }}
      >
        <div className="container">
          <div className="row g-5 align-items-center justify-content-center">
            <div className="col-md-6">
              <h1 className="fw-bold" style={{ fontSize: "3rem" }}>
                استمتع بأحدث وأقوى منصة
              </h1>
              <h2 style={{ color: "#109b58", fontSize: "2.5rem" }}>
                للرسائل البريدية
              </h2>
              <p className="mt-3 h4">
                نظام مراسلة بمفهوم جديد يوفر كل ما تحتاجه في عالم الرسائل.
              </p>
              <div className="d-flex justify-content-center gap-3 mt-4">
                <button className="btn btn-success px-4 fs-4">
                  حجز المنصة
                </button>
                <button className="btn btn-outline-success px-4 fs-4">
                  استكشاف الخدمات
                </button>
              </div>
            </div>
            <div className="col-md-6">
              <img src={email} alt="email illustration" className="w-100" />
            </div>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section className="container my-5">
        <div className="row g-5 align-items-center justify-content-center">
          <div className="col-6">
            <img src={invite} alt="" />
          </div>
          <div className="col-md-6">
            <h4 className="text-success fw-bold align-self-start h2">
              ABOUT US
            </h4>
            <p className="mb-0" style={{ fontSize: "1.1rem" }}>
              تقدم خدمة EmailSender من Mixtelecom Ltd، الرائدة في مجال الاتصالات
              الرقمية ومقرها لندن، للشركات إمكانية إرسال رسائل SMS باستخدام
              هويات مرسلة مخصصة، مما يعزز الاحترافية والثقة. تدعم الخدمة الرسائل
              الفردية والجماعية، مما يتيح إرسال إشعارات مستهدفة أو حملات واسعة
              النطاق. يمكن التكامل عبر واجهات برمجة التطبيقات (APIs) مع أدوات
              مثل أنظمة إدارة العلاقات مع العملاء (CRMs) ومنصات التجارة
              الإلكترونية لأتمتة وتخصيص الاتصالات. تشمل الميزات الرئيسية:
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

      {/* Services */}
      <section className="bg-light py-5">
        <div className="container text-center">
          <h4 className="text-success fw-bold mb-4">OUR SERVICES</h4>
          <div className="row">
            <div className="col-md-4">
              <div className="p-3 border rounded">
                <i
                  class="fa-solid fa-envelope fa-3x"
                  style={{ color: "#109b58" }}
                ></i>
                <h6 className="text-success h3 fw-bold my-3">إرسال متعدد</h6>
                <p className="fs-5">أرسل رسائل نصية وبريدية جماعية بسهولة.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3 border rounded">
                <i
                  class="fa-solid fa-copy  fa-3x"
                  style={{ color: "#109b58" }}
                ></i>
                <h6 className="text-success h3 fw-bold my-3">قوالب البريد</h6>
                <p className="fs-5">
                  أنشئ قوالب بريدية احترافية باستخدام أدوات مرنة.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3 border rounded">
                <i
                  class="fa-solid fa-phone fa-3x"
                  style={{ color: "#109b58" }}
                ></i>
                <h6 className="text-success h3 fw-bold my-3">
                  دعم على مدار الساعة
                </h6>
                <p className="fs-5">
                  فريق دعم متواجد دائمًا لحل مشاكلك ومساعدتك.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reseller
      <section className="container my-5 text-center">
        <h4 className="text-success fw-bold">RESELLERS</h4>
        <p>هل ترغب في أن تصبح موزعًا معتمدًا لخدمة الرسائل النصية؟</p>
        <ul className="list-unstyled">
          <li>تفعيل هوية مرسل OTP</li>
          <li>لوحة رسائل بسيطة لإدارة عملائك</li>
          <li>إمكانية وضع علامتك التجارية</li>
        </ul>
      </section> */}

      {/* Contact Us */}
      <section className="bg-white py-5">
        <div className="container">
          <h4 className="text-center text-success fw-bold mb-4">CONTACT US</h4>
          <form className="w-50 mx-auto">
            <input
              type="text"
              className="form-control mb-3"
              placeholder="الاسم الكامل"
            />
            <input
              type="text"
              className="form-control mb-3"
              placeholder="رقم الهاتف"
            />
            <input
              type="email"
              className="form-control mb-3"
              placeholder="البريد الإلكتروني"
            />
            <input
              type="text"
              className="form-control mb-3"
              placeholder="اسم الشركة"
            />
            <textarea
              className="form-control mb-3"
              placeholder="الرسالة"
              rows={4}
            ></textarea>
            <button className="btn btn-success w-100">إرسال</button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="text-center text-white py-4"
        style={{ backgroundColor: "#109b58" }}
      >
        <p>© جميع الحقوق محفوظة </p>
      </footer>
    </div>
  );
};

export default Home;
