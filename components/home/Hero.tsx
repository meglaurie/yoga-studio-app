export default function Hero() {
   return (
     <div className="flex flex-col items-center justify-center w-full h-screen bg-gradient-to-b from-blue-500 to-purple-600 text-white">
       <h1 className="text-5xl font-bold mb-4">Welcome to Our Yoga Studio</h1>
       <p className="text-xl mb-8">Find your inner peace and strength with our expert instructors.</p>
       <button className="px-6 py-3 bg-white text-blue-500 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition duration-300">
         Get Started
       </button>
     </div>
   );
 }