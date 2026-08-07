export default function CTA() {
  return (
    <div className="flex w-full flex-col items-center justify-center bg-zinc-100 py-16 dark:bg-zinc-900">
      <h2 className="text-center text-3xl font-bold text-zinc-900 dark:text-zinc-100">
        Ready to start your yoga journey?
      </h2>
      <p className="mt-4 text-center text-lg text-zinc-700 dark:text-zinc-300">
        Join our community and experience the benefits of yoga today.
      </p>
      <button className="mt-6 rounded bg-blue-600 px-6 py-3 text-lg font-semibold text-white hover:bg-blue-700">
        Sign Up Now
      </button>
    </div>
  );
}
