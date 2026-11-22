"use client";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container-page grid place-items-center py-24 text-center" role="alert">
      <div>
        <h1 className="text-3xl font-extrabold">Что-то пошло не так</h1>
        <p className="mt-2 text-muted">Мы не смогли загрузить эту страницу. Попробуйте ещё раз.</p>
        {process.env.NODE_ENV !== "production" && <pre className="mt-4 max-w-xl overflow-auto rounded-xl bg-surface-2 p-3 text-left text-xs">{error.message}</pre>}
        <div className="mt-6 flex justify-center gap-3">
          <button type="button" onClick={reset} className="btn btn-primary">Повторить</button>
          <Link href="/" className="btn btn-secondary">На главную</Link>
        </div>
      </div>
    </div>
  );
}
