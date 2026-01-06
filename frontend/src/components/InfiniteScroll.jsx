import React from "react";

const InfiniteScroll = () => {
  const className = "grocery";

  return (
    <>
      <style>
        {`
        .grocery_movingText::-webkit-scrollbar{
          display: none;
        }

        .grocery_movingText h1{
          animation: moving 27s linear infinite;
        }

        @media (max-width: 640px) {
          .grocery_movingText h1{
            animation-duration: 40s;
          }
        }

        @keyframes moving {
          from {
            transform: translateX(0%);
          }
          to {
            transform: translateX(-100%);
          }
        }
        `}
      </style>

      <div className="mt-10 lg:mt-0 mb-10 w-full overflow-hidden">
        <div className={`${className}_movingText flex flex-row`}>
          <h1 className="whitespace-nowrap text-4xl sm:text-6xl md:text-8xl lg:text-9xl">
            Always aware &bull; Quiet protection &bull; Move freely &bull; Safety
            that stays with you &bull; Smart support &bull; Designed for real
            journeys &bull;
          </h1>

          <h1 className="whitespace-nowrap text-4xl sm:text-6xl md:text-8xl lg:text-9xl">
            Always aware &bull; Quiet protection &bull; Move freely &bull; Safety
            that stays with you &bull; Smart support &bull; Designed for real
            journeys
          </h1>
        </div>
      </div>
    </>
  );
};

export default InfiniteScroll;
