import FeatureSplit from "@/components/layout/FeatureSplit";


export default function Benefits() { 
    return ( 
        <section className="flex flex-col items-center justify-center gap-8 py-16">
           <FeatureSplit

            image={'/schedule.jpg'}

            title="Benefits of Practicing Yoga"

            description="Regular yoga practice helps increase flexibility and range of motion."

            buttonText="View"

            reverse={false}

            />
           
            {/* <h2 className="text-3xl font-bold text-center text-zinc-900 dark:text-zinc-100">
                Benefits of Practicing Yoga
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md dark:bg-zinc-800">
                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Improved Flexibility</h3>
                    <p className="mt-2 text-center text-zinc-700 dark:text-zinc-300">
                        Regular yoga practice helps increase flexibility and range of motion.
                    </p>
                </div>
                <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md dark:bg-zinc-800">
                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Stress Reduction</h3>
                    <p className="mt-2 text-center text-zinc-700 dark:text-zinc-300">
                        Yoga promotes relaxation and helps reduce stress and anxiety.
                    </p>
                </div>
                <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md dark:bg-zinc-800">
                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Better Posture</h3>
                    <p className="mt-2 text-center text-zinc-700 dark:text-zinc-300">
                        Practicing yoga can improve posture and alignment, reducing back pain.
                    </p>
                </div>
            </div> */}
        </section>
    );
}