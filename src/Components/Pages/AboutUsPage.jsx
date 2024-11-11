import React from 'react';

const AboutUsPage = () => {
  return (
    <>
      <div className="p-1 bg-lewisRed text-white text-center font-bold">About Us</div>
      <div className="p-3 bg-lewisRed text-white text-center">Meet the Team Behind the Project</div>

      <div class="flex items-center">
        <img scr="./img/matt.jpg" alt='Matthew Bilinski' className="w-32 h-32 rounded-full mb-4 object-cover"/>
        <div>
          <strong>Matthew Bilinski</strong>
          <br></br>
          <a href="mailto:matthewrbilinski@lewisu.edu">matthewrbilinski@lewisu.edu</a>
        </div>
      </div>
    </>
  );
};

export default AboutUsPage;
