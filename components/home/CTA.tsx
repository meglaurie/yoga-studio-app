export default function CTA() {
  return (
    <div className="flex flex-col items-center justify-center w-full py-16 bg-zinc-100 dark:bg-zinc-900">
      <h2 className="text-3xl font-bold text-center text-zinc-900 dark:text-zinc-100">
        Ready to start your yoga journey?
      </h2>
      <p className="mt-4 text-lg text-center text-zinc-700 dark:text-zinc-300">
        Join our community and experience the benefits of yoga today.
      </p>
      <button className="px-6 py-3 mt-6 text-lg font-semibold text-white bg-blue-600 rounded hover:bg-blue-700">
        Sign Up Now
      </button>
    </div>
  );
}