"use client";

import {
  createContext,
  useContext,
  useReducer,
  useRef,
  useCallback,
} from "react";

type ToastVariant = "success" | "error";
type Toast = { id: number; message: string; variant: ToastVariant; exiting: boolean };

type ToastAction =
  | { type: "ADD"; toast: Toast }
  | { type: "START_EXIT"; id: number }
  | { type: "REMOVE"; id: number };

function toastReducer(toasts: Toast[], action: ToastAction): Toast[] {
  switch (action.type) {
    case "ADD":
      return [...toasts, action.toast];
    case "START_EXIT":
      return toasts.map((toast) =>
        toast.id === action.id ? { ...toast, exiting: true } : toast
      );
    case "REMOVE":
      return toasts.filter((toast) => toast.id !== action.id);
  }
}

type ToastContextValue = (message: string, variant?: ToastVariant) => void;

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const showToast = useContext(ToastContext);
  if (!showToast) {
    throw new Error("useToast must be used inside a ToastProvider");
  }
  return showToast;
}

const variantStyles: Record<ToastVariant, string> = {
  success: "bg-gray-900 text-white",
  error: "bg-red-600 text-white",
};

const VISIBLE_MS = 3000;
const EXIT_MS = 200;

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, dispatch] = useReducer(toastReducer, []);
  const nextId = useRef(0);

  const showToast = useCallback((message: string, variant: ToastVariant = "success") => {
    const id = nextId.current++;
    dispatch({ type: "ADD", toast: { id, message, variant, exiting: false } });
    setTimeout(() => dispatch({ type: "START_EXIT", id }), VISIBLE_MS);
    setTimeout(() => dispatch({ type: "REMOVE", id }), VISIBLE_MS + EXIT_MS);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${variantStyles[toast.variant]} ${
              toast.exiting ? "animate-toast-out" : "animate-toast-in"
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
