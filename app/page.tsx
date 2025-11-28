export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to Learn Lab
        </h1>
        <p className="text-center text-lg mb-4">
          A full-stack Next.js project with TypeScript, Tailwind CSS, and more.
        </p>
        <p className="text-center text-sm text-gray-600">
          Server is running successfully!
        </p>
      </div>
    </main>
  );
}

