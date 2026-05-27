import { api } from "~/trpc/server";

export default async function Home() {
  // const { status } = await api.health.getHealth.query();
  //const { message } = await api.learning.query({ email: "test@e.com" })
  return (
    <main className="min-h-screen min-w-screen flex justify-center items-center">
      <div>
        <h1 className="text-3xl">Streamyst - Stream in Style</h1>
      </div>
    </main>
  );
}
