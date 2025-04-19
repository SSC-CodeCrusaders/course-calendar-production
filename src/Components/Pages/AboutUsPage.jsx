import React from 'react';

const AboutUsPage = () => {
  return (
    <>
      <div className="p-1 bg-lewisRed text-white text-5xl text-center font-bold">About Us</div>
      <div className="p-3 bg-lewisRed text-white text-xl text-center">Meet the Team Behind the Project</div>
      
      <div className="relative w-screen h-screen">
        <div className="absolute inset-0 bg-cover bg-center opacity-30 z-0 mt--4"
        style={{
          backgroundImage: "url('/img/lewis_front.jpg')",
        }}
        ></div>
        <div>
          <div className=' p-1 mt-0 font-bold text-2xl text-center text-black relative z-10'>Main Developers</div>
          <div className="mx-4 w-90 h-2 bg-black rounded relative z-10"></div>
        </div>

        {/* Section for Grid layout of 3 columns for the capstone team */}
        <div className="grid grid-cols-3 gap-4 p-4 hover:grid-cols-3 z-10 relative">
          {/*Mateusz's About*/}
          <div className='flex items-center group/item hover:bg-red-700 bg-lewisRed p-3'>
            <img src="/img/matto.jpg" alt='Mateusz Obrochta' className=" ml-2 mr-1 mt-2 w-40 h-40 rounded-full object-cover"/>
            <div className='ml-2 overflow-hidden'>
              <strong className='mb-1 text-xl text-white'>Mateusz Obrochta</strong>
              <br></br>
              <a className="text-b  truncate text-white" href="mailto:mateuszobrochta@lewisu.edu">mateuszobrochta@lewisu.edu</a>
            </div>
          </div>
          
          {/*Matthew Bilinski's About*/}
          <div className='flex items-center group/item hover:bg-red-700 bg-lewisRed p-3'>
            <img src="/img/matt.jpg" alt='Matthew Bilinski' className=" ml-2 mr-1 mt-2 w-40 h-40 rounded-full object-cover"/>
            <div className='ml-2 overflow-hidden'>
              <strong className='mb-1 text-xl text-white'>Matthew Bilinski</strong>
              <br></br>
              <a className="text-b  truncate text-white" href="mailto:matthewrbilinski@lewisu.edu">matthewrbilinski@lewisu.edu</a>
            </div>
          </div>

          {/*Ivan's About*/}
          <div className='flex items-center group/item hover:bg-red-700 bg-lewisRed p-3'>
            <img src="/img/ivan.jpg" alt='Ivan Sanchez' className=" ml-2 mr-1 mt-2 w-40 h-40 rounded-full object-cover"/>
            <div className='ml-2 overflow-hidden'>
              <strong className='mb-1 text-xl text-white'>Ivan Sanchez</strong>
              <br></br>
              <a className="text-b  truncate text-white" href="mailto:ivansanchez@lewisu.edu">ivansanchez@lewisu.edu</a>
            </div>
          </div>
        </div>

        <div>
        <div className=' p-1 mt-1 font-bold text-2xl text-center text-black relative z-10'>Additional Developers</div>
        <div className="mx-4 w-90 h-2 bg-black rounded relative z-10"></div>
        </div>

        {/*TEST TO SEE IF I CAN HAVE 4 COLUMNS FOR OUR TEAM*/}
        <div className="grid grid-cols-4 gap-4 p-4 hover:grid-cols-4 relative z-10">
          {/*Jason's About*/}
          <div className='flex items-center group/item hover:bg-red-700 bg-lewisRed p-2'>
            <img src="/img/jasony.jpg" alt='Jason Yescas' className=" ml-2 mr-1 mt-2 w-32 h-32 rounded-full object-cover"/>
            <div className='ml-2 overflow-hidden'>
              <strong className='mb-1 text-xl text-white'>Jason Yescas</strong>
              <br></br>
              <a className="text-b  truncate text-white" href="mailto:jasonyescas@lewisu.edu">jasonyescas@lewisu.edu</a>
            </div>
          </div>

          {/*Matthew Shouse's About*/}
          <div className='flex items-center group/item hover:bg-red-700 bg-lewisRed p-2'>
            <img src="/img/matthews.png" alt='Matthew Shouse' className=" ml-2 mr-1 mt-2 w-32 h-32 rounded-full object-cover"/>
            <div className='ml-2 overflow-hidden'>
              <strong className='mb-1 text-xl text-white'>Matthew Shouse</strong>
              <br></br>
              <a className="text-b  truncate text-white" href="mailto:matthewdshouse@lewisu.edu">matthewdshouse@lewisu.edu</a>
            </div>
          </div>

          {/*Nikhila's About*/}
          <div className='flex items-center group/item hover:bg-red-700 bg-lewisRed p-2'>
            <img src="/img/nikhila.jpg" alt='Nikhila Gonuguntla' className=" ml-2 mr-1 mt-2 w-32 h-32 rounded-full object-cover"/>
            <div className='ml-2 overflow-hidden'>
              <strong className='mb-1 text-xl text-white'>Nikhila Gonuguntla</strong>
              <br></br>
              <a className="text-b  truncate text-white" href="mailto:nikhilagonuguntla@lewisu.edu">nikhilagonuguntla@lewisu.edu</a>
            </div>
          </div>

          {/*Josh's About*/}
          <div className='flex items-center group/item hover:bg-red-700 bg-lewisRed p-2'>
            <img src="/img/joshua.jpg" alt='Joshua Bunty' className=" ml-2 mr-1 mt-2 w-32 h-32 rounded-full object-cover"/>
            <div className='ml-2 overflow-hidden'>
              <strong className='mb-1 text-xl text-white'>Joshua Bunty</strong>
              <br></br>
              <a className="text-b  truncate text-white" href="mailto:joshuambunty@lewisu.edu">joshuambunty@lewisu.edu</a>
            </div>
          </div>

          {/*Aaron's About*/}
          <div className='flex items-center group/item hover:bg-red-700 bg-lewisRed p-2'>
            <img src="/img/aaron.jpg" alt='Aaron Rader' className=" ml-2 mr-1 mt-2 w-32 h-32 rounded-full object-cover"/>
            <div className='ml-2 overflow-hidden'>
              <strong className='mb-1 text-xl text-white'>Benyamin Bamburac</strong>
              <br></br>
              <a className="text-b  truncate text-white" href="mailto:aaronrader@lewisu.edu">aaronrader@lewisu.edu</a>
            </div>
          </div>
        
          {/*Benyamin's About*/}
          <div className='flex items-center group/item hover:bg-red-700 bg-lewisRed p-2'>
            <img src="/img/benyamin.jpg" alt='Benyamin Bamburac' className=" ml-2 mr-1 mt-2 w-32 h-32 rounded-full object-cover"/>
            <div className='ml-2 overflow-hidden'>
              <strong className='mb-1 text-xl text-white'>Benyamin Bamburac</strong>
              <br></br>
              <a className="text-b  truncate text-white" href="mailto:benyaminfbamburac@lewisu.edu">benyaminfbamburac@lewisu.edu</a>
            </div>
          </div>
        </div>
      </div>
      

      {/*
      <div className="w-screen h-screen">
        <div classname="grid grid-cols-3 gap-3">
          <div classname="flex items-center">
            <img src="/img/matt.jpg" alt='Matthew Bilinski' className=" ml-2 mr-3 mt-4 w-32 h-32 rounded-full object-cover"/>
            <div>
              <strong className='mb-1'>Matthew Bilinski</strong>
              <br></br>
              <a href="mailto:matthewrbilinski@lewisu.edu">matthewrbilinski@lewisu.edu</a>
            </div>
          </div>

          <div classname="flex items-center">
            <img src="/img/matto.jpg" alt='Matthew Bilinski' className=" ml-2 mr-3 mt-4 w-32 h-32 rounded-full object-cover"/>
            <div>
              <strong className='mb-1'>Matthew Bilinski</strong>
              <br></br>
              <a href="mailto:matthewrbilinski@lewisu.edu">matthewrbilinski@lewisu.edu</a>
            </div>
          </div>
        </div>
      </div>
      */}
    </>
  );
};

export default AboutUsPage;
