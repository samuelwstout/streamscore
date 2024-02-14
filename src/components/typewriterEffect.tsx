import { useState, useEffect } from "react";

const TypewriterEffect = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const intervalId = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) {
        clearInterval(intervalId);
      }
    }, 5);
    return () => clearInterval(intervalId);
  }, [text]);

  return <div>{displayedText}</div>;
};

export default TypewriterEffect;
