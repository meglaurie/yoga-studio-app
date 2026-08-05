export default function PricingPreview() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-gradient-to-b from-green-400 to-blue-500 text-white">
      <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
      <p className="text-xl mb-8">Choose the plan that works best for you.</p>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="bg-white text-blue-500 p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-2">Basic</h3>
          <p className="text-3xl font-bold mb-4">$19<span className="text-lg">/month</span></p>
          <ul className="list-disc list-inside mb-4">
            <li>Access to all classes</li>
            <li>Basic support</li>
          </ul>
          <button className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300">
            Get Started
          </button>
        </div>
        <div className="bg-white text-purple-500 p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-2">Premium</h3>
          <p className="text-3xl font-bold mb-4">$29<span className="text-lg">/month</span></p>
          <ul className="list-disc list-inside mb-4">
            <li>Access to all classes</li>
            <li>Priority support</li>
            <li>Personalized coaching</li>
          </ul>
          <button className="px-6 py-3 bg-purple-500 text-white font-semibold rounded-lg shadow-md hover:bg-purple-600 transition duration-300">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
