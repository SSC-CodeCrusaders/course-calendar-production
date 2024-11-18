import React from "react";

const TutorialPage = () => {
    return (
        <>
            <h2 className="text-3xl bg-lewisRed font-bold p-2 text-center text-white">
                GETTING STARTED
            </h2>
            <p className="text-xl bg-lewisRed text-white text-center p-3">
                Follow these simple steps to quickly set up and use 
                LewisCal for organizing your academic schedule.
            </p>
            <div className="relative h-screen w-screen">
                <div className="absolute inset-0 bg-cover bg-center opacity-30 z-0 mt--4"
                style={{ 
                    backgroundImage: "url('/img/lewis_front.jpg')", 
                }}
                ></div>
                <div className="relative z-10 p-6">
                    <section className="bg-white shadow-md rounded-lg p-4 max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold mb-4">LewisCal Tutorial</h2>
                        <div className="mb-4">
                            <h3 className="text-xl font-semibold mb-4">
                                Step 1 - Enter your Course Details:
                            </h3>
                            <p>
                                Start by entering your class information such as
                                the course name, days of the week, time, and 
                                professor's name. You can include optional details
                                like class location or notes to make your schedule more
                                detailed.
                            </p>
                        </div>
                        <div className="mb-4">
                            <h3 className="text-xl font-semibold mb-4">
                                Step 2 - Generate your Schedule File:
                            </h3>
                            <p>
                                After entering your course details, click on the "Generate"
                                button. This will create an '.ics' file that contains your
                                complete academic schedule. The '.ics' format is widely supported
                                by most calendar applications.
                            </p>
                        </div>
                        <div className="mb-4">
                            <h3 className="text-xl font-semibold mb-4">
                                Step 3 - Import into your Calendar:
                            </h3>
                            <p>
                                Open a calendar application of your preference (Google Calendar,
                                Outlook, Apple Calendar, etc.) and look for the 'Import' or 
                                'Add Calendar' option.
                            </p>
                        </div>
                        <div className="mb-4">
                            <h3 className="text-xl font-semibold mb-4">
                                Step 4 - Review and Adjust:
                            </h3>
                            <p>
                                Review the imported schedule to make sure all details are accurate.
                                If you notice any discrepancies or want to make changes, you can
                                go back to LewisCal, update your course details, and regenerate the
                                '.ics' file.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
};
     
export default TutorialPage;