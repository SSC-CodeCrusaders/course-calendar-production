import React from "react";



const FeaturesPage = () => {
  return (<div className="relative min-h-full">
	<div className="absolute inset-0 bg-cover bg-center opacity-30 z-0 pointer-events-none"
							style={{ 
									backgroundImage: "url('/img/lewis_front.jpg')", 
							}}
                ></div>
    <div className="relative container mx-auto px-8 py-12 z-10">
      <h2 className="text-4xl font-bold mb-6 text-primary text-center">
        Key Features
      </h2>
      <p className="text-center text-gray-700 mb-12">
        LewisCal simplifies your academic schedule management. Explore some of
        the core features that make this tool invaluable for both students and
        faculty. 
        <br></br> If you would like to suggest features please click&nbsp;
        <a href="https://docs.google.com/forms/d/1VWIMOUrLhk1yNOYR5OCSVOFuWmRcDQYqCbBNADK2gxg/edit" target="_blank" 
        style={{
           color: 'blue',             // Default color for unvisited links
           textDecoration: 'underline', // Default underline for links
            ':visited': {
              color: 'purple'          // Default color for visited links
            },
            ':hover': {
               color: 'red',            // Default color on hover
               textDecoration: 'underline' // Maintain underline on hover
            },
             ':active': {
               color: 'red'             // Default color for active links
            }
          }}
          >
        here
        </a>.
      </p>
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {/* Feature 1 */}
        <li className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-2 text-primary">
            Automatic .ics File Generation
          </h3>
          <p>
            Convert your course schedules into .ics files that can be imported
            into Google Calendar, Outlook, and more.
          </p>
        </li>

        {/* Feature 2 */}
        <li className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-2 text-primary">
            Seamless Integration
          </h3>
          <p>
            Enjoy a seamless experience across all devices and platforms with
            our easy-to-use interface.
          </p>
        </li>

        {/* Feature 3 */}
        <li className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-2 text-primary">
            User-Friendly Interface
          </h3>
          <p>
            Our intuitive UI ensures that importing schedules is as easy as a
            few clicks, with helpful prompts and guides.
          </p>
        </li>

        {/* Feature 4 */}
        <li className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-2 text-primary">
            Customizable Options
          </h3>
          <p>
            Customize your import settings to include only the events and
            details you need, making your schedule uniquely yours.
          </p>
        </li>
      </ul>
    </div>
	</div>);
};

export default FeaturesPage;
