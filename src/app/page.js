export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <section className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold text-slate-900">Smart Tutor</h1>

        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          AI-powered education support for study doubts, exam preparation,
          mock tests, course guidance, and personalized learning plans.
        </p>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">
            Welcome to Smart Tutor
          </h2>

          <p className="mt-3 text-slate-600">
            Click the chatbot button at the bottom-right corner to start.
          </p>
        </div>
      </section>
    </main>
  );
}