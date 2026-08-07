export default function PricingPreview() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center text-white bg-olive-500">
      <h2 className="mb-4 text-4xl font-bold">Simple, Transparent Pricing</h2>
      <p className="mb-8 text-xl">Choose the plan that works best for you.</p>
      <div className="flex flex-col gap-8 md:flex-row">
        <div className="rounded-lg bg-white p-6 text-blue-500 shadow-md">
          <h3 className="mb-2 text-2xl font-bold">Basic</h3>
          <p className="mb-4 text-3xl font-bold">
            $19<span className="text-lg">/month</span>
          </p>
          <ul className="mb-4 list-inside list-disc">
            <li>Access to all classes</li>
            <li>Basic support</li>
          </ul>
          <button className="rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white shadow-md transition duration-300 hover:bg-blue-600">
            Get Started
          </button>
        </div>
        <div className="rounded-lg bg-white p-6 text-purple-500 shadow-md">
          <h3 className="mb-2 text-2xl font-bold">Premium</h3>
          <p className="mb-4 text-3xl font-bold">
            $29<span className="text-lg">/month</span>
          </p>
          <ul className="mb-4 list-inside list-disc">
            <li>Access to all classes</li>
            <li>Priority support</li>
            <li>Personalized coaching</li>
          </ul>
          <button className="rounded-lg bg-purple-500 px-6 py-3 font-semibold text-white shadow-md transition duration-300 hover:bg-purple-600">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
