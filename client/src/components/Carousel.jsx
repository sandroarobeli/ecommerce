import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSwipeable } from "react-swipeable";

import PrevSlideIcon from "./icons/PrevSlideIcon";
import NextSlideIcon from "./icons/NextSlideIcon";

export default function Carousel({ products }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [carouselPaused, setCarouselPaused] = useState(false);

  // Auto cycle function
  useEffect(() => {
    const interval = setInterval(() => {
      if (!carouselPaused) {
        setCurrentImage(
          currentImage === products.length - 1 ? 0 : currentImage + 1
        );
      }
    }, 3000);

    return function cleanup() {
      if (interval) {
        clearInterval(interval);
      }
    };
  });

  // Provides hand swiping functionality on mobile devices
  const handlers = useSwipeable({
    onSwipedLeft: () =>
      setCurrentImage(
        currentImage === products.length - 1 ? 0 : currentImage + 1
      ),
    onSwipedRight: () =>
      setCurrentImage(
        currentImage === 0 ? products.length - 1 : currentImage - 1
      ),
  });

  return (
    <div
      {...handlers}
      className="relative overflow-hidden w-full mx-auto mb-4"
      onMouseEnter={() => setCarouselPaused(true)}
      onMouseLeave={() => setCarouselPaused(false)}
    >
      {products.map((product, index) => (
        <Link
          to={`/product/${product.slug}`}
          key={product.id}
          className={`${
            currentImage === index ? "block opacity-100" : "hidden"
          } animate-fade`}
        >
          <img
            src={product.image}
            alt={product.name}
            fetchpriority={`${index === 0 ? "high" : "low"}`}
            className="w-full h-[350px] object-cover object-center cursor-pointer"
          />
          <h1 className="text-amber-500 my-2 absolute bottom-0 min-w-full text-center font-oswald text-3xl">
            {product.name}
          </h1>
        </Link>
      ))}
      <button
        aria-label="Navigate back"
        onClick={() =>
          setCurrentImage(
            currentImage === 0 ? products.length - 1 : currentImage - 1
          )
        }
        className="absolute top-0 left-0 w-0 sm:w-[30px] h-full border-none outline-none z-10 focus:outline-none transition-all ease-in-out duration-300 bg-transparent hover:bg-black/25"
      >
        <PrevSlideIcon />
      </button>
      <button
        aria-label="Navigate forward"
        onClick={() =>
          setCurrentImage(
            currentImage === products.length - 1 ? 0 : currentImage + 1
          )
        }
        className="absolute top-0 right-0 w-0 sm:w-[30px] h-full border-none outline-none z-10 focus:outline-none transition-all ease-in-out duration-300 bg-transparent hover:bg-black/25"
      >
        <NextSlideIcon />
      </button>
    </div>
  );
}
