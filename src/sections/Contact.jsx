import Background from "../components/background";

export default function Home() {
  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden bg-black"
    >
      <Background />

      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <h1 className="text-white text-4xl font-bold">
          contact Section
        </h1>
      </div>
    </section>
  );
}