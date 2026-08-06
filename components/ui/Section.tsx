type SectionProps = {
  children: React.ReactNode;
};

export default function Section({ children }: SectionProps) {
  return (
    <section className="flex flex-col items-center justify-center w-full py-16 px-8 bg-gray-100 dark:bg-gray-900">
     {children}
    </section>
  );}