import React, { useEffect, useState } from "react";

function Banner({ data })
{
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() =>
    {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (!data) return null;

    return width < 640
        ? <Carousel data={data.banner_mobile} intervalTime={2500} height="h-56" />
        : <Carousel data={data.banner_desktop} intervalTime={3500} height="h-[420px]" />;
}

export default Banner;


function Carousel({ data = [], intervalTime = 3000, height })
{
    const [idx, setIdx] = useState(0);
    const [paused, setPaused] = useState(false);

    useEffect(() =>
    {
        if (!data.length || paused) return;

        const interval = setInterval(() =>
        {
            setIdx(prev => (prev + 1) % data.length);
        }, intervalTime);

        return () => clearInterval(interval);
    }, [data, paused, intervalTime]);

    if (!data.length) return null;

    return (
        <div
            className={`relative w-full overflow-hidden ${height}`}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {/* Image */}
            <div
                className="w-full h-full cursor-pointer"
                onClick={() =>
                {
                    if (data[idx]?.href)
                    {
                        window.open(data[idx].href, "_blank");
                    }
                }}
            >
                <img
                    src={data[idx]?.url}
                    alt=""
                    className="w-full h-full object-cover transition-opacity duration-700"
                    loading="lazy"
                />
            </div>

            {/* Left Button */}
            {data.length > 1 && (
                <button
                    onClick={() =>
                        setIdx(idx === 0 ? data.length - 1 : idx - 1)
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 
                               bg-black/40 hover:bg-black/60 
                               text-white text-3xl px-3 py-1 
                               rounded-md transition"
                >
                    ‹
                </button>
            )}

            {/* Right Button */}
            {data.length > 1 && (
                <button
                    onClick={() =>
                        setIdx((idx + 1) % data.length)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 
                               bg-black/40 hover:bg-black/60 
                               text-white text-3xl px-3 py-1 
                               rounded-md transition"
                >
                    ›
                </button>
            )}

            {/* Dots */}
            <div className="absolute bottom-4 w-full flex justify-center gap-2">
                {data.map((_, i) => (
                    <span
                        key={i}
                        onClick={() => setIdx(i)}
                        className={`w-3 h-3 rounded-full cursor-pointer transition
                            ${i === idx ? "bg-white" : "bg-white/50 hover:bg-white"}`}
                    />
                ))}
            </div>
        </div>
    );
}
