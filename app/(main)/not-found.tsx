import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-20">
      <h1 className="text-6xl font-bold text-default-200">404</h1>
      <p className="text-lg text-default-500">
        This page could not be found.
      </p>
      <Link
        href="/"
        className="text-accent hover:underline font-medium"
      >
        &larr; Back to home
      </Link>
    </div>
  );
}
