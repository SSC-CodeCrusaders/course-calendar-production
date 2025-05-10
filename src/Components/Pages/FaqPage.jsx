// import React from "react";

// const FaqPage = () => {
//   return (
//     <>
//       <div className="p-2 bg-lewisRed text-white text-3xl text-center font-bold">
//         FREQUENTLY ASKED QUESTIONS
//       </div>
//       <div className="p-3 bg-lewisRed text-white text-xl text-center">
//         Have questions? Check the below FAQs
//       </div>

//       <div className="relative w-screen h-screen">
//         <div
//           className="absolute inset-0 bg-cover bg-center opacity-30 z-0 mt--4"
//           style={{
//             backgroundImage: "url('/img/lewis_front.jpg')",
//           }}
//         ></div>
//       </div>
//     </>
//   );
// };

// export default FaqPage;


import React from "react";

const FaqPage = () => {
  return (
    <>
      <div className="relative min-h-full">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 z-0 mt--4"
          style={{
            backgroundImage: "url('/img/lewis_front.jpg')",
          }}
        ></div>

      <div className="relative p-2 bg-lewisRed text-white text-3xl text-center font-bold z-10">
        FREQUENTLY ASKED QUESTIONS
      </div>
      <div className="relative p-3 bg-lewisRed text-white text-xl text-center z-10">
        Have questions? Check the below FAQs
      </div>

        <div className="relative z-10 p-6">
          <div className="bg-white rounded-lg shadow-md p-4 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">LewisCal FAQs</h2>
            <div className="mb-4">
              <h3 className="text-xl font-semibold">What does LewisCal do?</h3>
              <p>
                LewisCal helps you quickly import your course information into
                your calendar. You enter your class details—such as time, day,
                and professor—and the tool generates an <code>.ics</code> file
                that you can easily add to your preferred calendar app.
              </p>
            </div>
            <div className="mb-4">
              <h3 className="text-xl font-semibold">How do I use the .ics file?</h3>
              <p>
                Once you’ve entered your class information and generated the
                <code>.ics</code> file, you can import it into any calendar
                application that supports the <code>.ics</code> format, such as
                Google Calendar, Outlook, or Apple Calendar. Simply open your
                calendar app, look for the “Import” option, and select the file
                you created.
              </p>
            </div>
            <div className="mb-4">
              <h3 className="text-xl font-semibold">What information do I need to enter?</h3>
              <p>
                You need to enter the basic details of each of your classes:
                course name, time, days of the week, and professor’s name.
                Optional fields can include location and any notes you want to
                add.
              </p>
            </div>
            <div className="mb-4">
              <h3 className="text-xl font-semibold">Is LewisCal free to use?</h3>
              <p>
                Yes, LewisCal is completely free to use. It's designed to save
                time and simplify the process of keeping your academic schedule
                organized.
              </p>
            </div>
            <div className="mb-4">
              <h3 className="text-xl font-semibold">Who is this tool for?</h3>
              <p>
                LewisCal is primarily for students and faculty who want to
                organize their class schedules more efficiently. It's perfect
                for anyone who prefers to have all their commitments easily
                accessible in a digital calendar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FaqPage;
