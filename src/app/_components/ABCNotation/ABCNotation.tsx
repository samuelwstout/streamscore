import { useRef, useEffect } from "react";
import { renderAbc } from "abcjs";

function ABCNotation({ content }: { content: string }) {
  const abcContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (abcContainerRef.current) {
      renderAbc(abcContainerRef.current, content);
    }
  }, [content]);

  return (
    <div className="overflow-x-scroll">
      <div ref={abcContainerRef} className="min-w-[800px]" />
    </div>
  );
}

export default ABCNotation;
