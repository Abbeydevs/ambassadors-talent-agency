import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-24 bg-[#1E40AF] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>

      <div className="container mx-auto px-4 relative z-10 text-center text-white">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
          Ready to Start Your Journey?
        </h2>
        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto font-light">
          Join thousands of African creatives building their careers with
          Ambassador Talent Agency today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/register?role=TALENT">
            <Button
              size="lg"
              className="bg-white text-[#1E40AF] hover:bg-slate-100 text-lg px-8 py-6 font-semibold shadow-lg"
            >
              Join as Talent
            </Button>
          </Link>
          <Link href="/auth/register?role=EMPLOYER">
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-[#1E40AF]/50 text-lg px-8 py-6 font-semibold"
            >
              Hire Talent
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
