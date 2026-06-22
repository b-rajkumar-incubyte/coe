"use client";

type Props = {
  label: string;
  pendingLabel: string;
  disabled?: boolean;
};

export default function SubmitButton({ label, pendingLabel, disabled }: Props) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="w-full py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {disabled && (
        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      )}
      {disabled ? pendingLabel : label}
    </button>
  );
}
