import React from 'react'
import { NavLink } from 'react-router-dom';

const Footer = () => {
  const icons = [<i className="ri-linkedin-box-fill"></i>,<i className="ri-twitter-x-line"></i>,<i className="ri-instagram-fill"></i>,<i className="ri-youtube-fill"></i>]
  const links = ["https://www.linkedin.com/","https://x.com/","https://www.instagram.com/","https://www.youtube.com/"]
  const heading = ["About", "Features", "Support", "Get Help"];

const footer = {
  1: [
    "Our Mission",
    "How It Works",
    "Safety Principles",
    "About the Team",
  ],
  2: [
    "Live Safety Score",
    "SOS Alerts",
    "Safe Route Guidance",
    "Community Reports",
  ],
  3: [
    "Help Center",
    "Emergency FAQs",
    "Report an Issue",
    "Privacy & Security",
  ],
  4: [
    "24/7 Emergency Support",
    "Available Nationwide",
    "India",
    "Contact Support",
  ],
};
  return (
    <div>
      <div className='w-full h-auto lg:h-[80vh] bg-[#d3e6f8] overflow-hidden'>
        <div className='w-full h-[50%] flex flex-col lg:flex-row justify-start items-start lg:justify-around lg:items-center ml-5 lg:ml-0 mt-5 lg:mt-0'>
          <div className='w-full md:w-[30%] h-[90%] flex justify-start items-start lg:justify-center lg:items-center'>
            <div className='w-[90%]'>
              <h1 className='text-4xl lg:text-6xl logo_i m-0 text-white'>AegisHer</h1>
              <h3 className='my-2.5 text-[13px] lg:text-[14px] text-[#88b7e6]'>Every feature carries more care than expected — from our commitment to your safety, wherever you are.</h3>
              <div className='flex justify-start gap-3 mb-5 lg:mb-0'>
                {icons.map((item,index) =>(
                   <NavLink key={index} to={links[index]}>
                      <div className="w-14 h-14 rounded-full shadow-sm bg-white flex justify-center items-center text-xl hover:text-[24px] text-[#88b7e6]">{item}</div>
                   </NavLink>
                ))}
              </div>
            </div>
          </div>
          {heading.map((item,index)=>(
            <div key={index} className='w-full lg:w-[15%] h-[90%] justify-start items-start flex lg:justify-center text-white lg:items-center'>
            <div>
              <h1 className='text-[18px] lg:text-[22px]'>{item}</h1>
              {footer[index + 1].map((itm,idx)=>(
                <h3 key={idx} className='text-[13px] lg:text-[14px] p-1.75 pl-0 text-[#88b7e6] hover:cursor-pointer hover:scale-102 hover:font-semibold hover:underline hover:underline-offset-2'>{itm}</h3>
              ))}
            </div>
          </div>
          ))}
        </div>
        <div className='w-full h-auto'>
            <h1 className='text-7xl lg:text-[230px] text-[#88b7e6] text-center opacity-40 backdrop-opacity-90'>AegisHer</h1></div>
      </div>
    </div>
  )
}

export default Footer


