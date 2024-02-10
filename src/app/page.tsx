export default function Home() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center">
      <div>
        <iframe
          src="https://giphy.com/embed/3oz8xtBx06mcZWoNJm"
          className="w-full aspect-auto"
          allowFullScreen
        ></iframe>
        <div className="p-10 flex flex-col items-center justify-center gap-5">
          <p>
            Hey! I&aposm building a music education AI tool called Streamscore.
          </p>
          <p>
            As you can see, I&aposm busy building and plan to have a first
            version out soon :)
          </p>
        </div>
      </div>
    </main>
  );
}
