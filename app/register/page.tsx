import { redirect } from "next/navigation";
import { RegistrationWizard } from "@/components/register/registration-wizard";
import { getSession } from "@/lib/session";

export default async function RegisterPage() {
  const session = await getSession();
  if (session) {
    redirect("/map");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
      <div className="w-full max-w-3xl">
        <header className="mb-5 text-center">
          <h1 className="mt-1 text-3xl font-bold text-white sm:text-4xl">
            Join to <span className="text-[#3776ab]">Py</span>
            <span className="text-[#f7df5f]">tonista</span>
          </h1>
          <p className="mt-2 text-sm text-slate-300">Create your public developer profile and join the map.</p>
        </header>
        <RegistrationWizard />
      </div>
    </main>
  );
}
