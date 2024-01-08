import { Link } from 'react-router-dom';

function Home() {
  return (
    <section className="w-full h-screen pt-12 md:pt-24 lg:pt-32 bg-[#064420] dark:bg-[#064420] bg-pattern">
      <div className="container space-y-10 xl:space-y-16">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-[#c5f7c4] dark:text-[#c5f7c4]">
              FlowCraft
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 font-bold text-">
              Empowering Users to Build, Edit, and Visualize Dynamic Workflows
              for Big Data using csv
            </p>
          </div>
          <div className="space-x-4">
            <Link
              className="inline-flex h-9 items-center justify-center rounded-md bg-[#c5f7c4] px-4 py-2 text-sm font-medium text-[#064420] shadow transition-colors hover:bg-[#c5f7c4]/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#064420] disabled:pointer-events-none disabled:opacity-50 dark:bg-[#c5f7c4] dark:text-[#064420] dark:hover:bg-[#c5f7c4]/90 dark:focus-visible:ring-[#064420]"
              to={'/dashboard'}
            >
              Get Started
            </Link>
          </div>
        </div>
        <div className="h-96 shadow-lg">
          <img
            alt="Hero"
            className="mx-auto h-full overflow-hidden rounded-t-xl object-cover object-center"
            src="/demo.png"
          />
        </div>
      </div>
    </section>
  );
}

export default Home;
