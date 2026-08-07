export default function FeaturedClasses() {
  return (
    <section className="w-full bg-zinc-50 py-16 dark:bg-black">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
          Featured Classes
        </h2>
        <p className="mt-2 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Explore our most popular classes and find the perfect fit for your yoga journey.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Class cards will go here */}
        </div>
      </div>
    </section>
  );
}
