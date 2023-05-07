import { useState, useEffect } from "react";

export default function Countdown() {
  const [timeRemaining, setTimeRemaining] = useState(60);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeRemaining((prevTimeRemaining) => prevTimeRemaining - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      {timeRemaining > 0 ? (
        <p className="mt-10 text-left text-sm text-gray-500">
          Send again in{" "}
          <span className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
            {timeRemaining}
          </span>
        </p>
      ) : (
        <p className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 text-sm"></p>
      )}
    </div>
  );
}
