"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ToastProvider";

const flashMessages: Record<string, string> = {
  created: "Task created",
  updated: "Changes saved",
  deleted: "Task deleted",
};

export default function ToastFlash() {
  const showToast = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const flash = searchParams.get("toast");
  const lastFired = useRef<string | null>(null);

  useEffect(() => {
    if (!flash) {
      lastFired.current = null;
      return;
    }
    if (lastFired.current === flash) return;

    lastFired.current = flash;
    const message = flashMessages[flash];
    if (message) showToast(message);
    router.replace(pathname);
  }, [flash, pathname, router, showToast]);

  return null;
}
