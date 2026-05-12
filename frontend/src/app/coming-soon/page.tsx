"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Construction } from "lucide-react";

function ComingSoonContent() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title") || "This Feature";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent/10">
          <Construction size={40} className="text-accent" />
        </div>
        <h1 className="text-2xl font-bold text-navy mb-2">{title}</h1>
        <p className="text-slate-500 text-lg">Coming soon</p>
        <p className="text-slate-400 mt-2 max-w-md">
          We&apos;re working hard to bring this feature to life. Stay tuned for updates.
        </p>
      </div>
    </div>
  );
}

export default function ComingSoonPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-slate-400">Loading...</div>}>
      <ComingSoonContent />
    </Suspense>
  );
}
