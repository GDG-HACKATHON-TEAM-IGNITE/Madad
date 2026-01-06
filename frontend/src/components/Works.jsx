import React from 'react'

const Works = () => {

  const howItWorks = [
    {
      step: "01",
      title: "Understands Your Surroundings",
      description:
        "The app quietly analyzes your surroundings using time, location, nearby routes, and community safety data.",
    },
    {
      step: "02",
      title: "Shows Live Safety Score",
      description:
        "You instantly see a clear safety score along with simple reasons explaining what affects your safety.",
    },
    {
      step: "03",
      title: "Prepares Before Risk Escalates",
      description:
        "If the risk level rises, Pre-SOS mode activates silently and starts sharing your live location with trusted contacts.",
    },
    {
      step: "04",
      title: "One Tap Sends Help",
      description:
        "In case of danger, a single tap sends SOS alerts instantly — even working through SMS when offline.",
    },
  ];

  return (
    <div>
      <div className="bg-[#d3e6f8] w-full h-auto flex flex-col-reverse lg:flex-row justify-around items-center px-5 lg:px-0">

        {/* LEFT */}
        <div className="w-full lg:w-[50%] h-auto lg:pr-10 lg:pl-10 pt-0 lg:pt-5 mb-10 flex flex-col justify-center">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl lg:text-left text-white mb-7 mt-0 lg:mt-10 text-center">
            How it works
          </h1>

          {howItWorks.map((item, index) => (
            <div
              key={index}
              className="flex items-start mb-6"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-7xl text-white mr-4 leading-none">
                {item.step}
              </h1>
              <div>
                <h3 className="text-lg sm:text-xl text-white">
                  {item.title}
                </h3>
                <p className="text-[13px] lg:text-sm text-[#88b7e6] max-w-md">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT */}
        <div className="w-full lg:w-[40%] h-72 sm:h-96 lg:h-120 shadow-sm rounded-2xl mb-10 lg:mb-0 mt-10 lg:mt-0">
          <img
            src="https://i.pinimg.com/1200x/b8/6c/7a/b86c7a4c278d4e4c95d6ad32883b8772.jpg"
            alt=""
            className="object-cover w-full h-full rounded-2xl"
          />
        </div>

      </div>
    </div>
  )
}

export default Works
