export default async function Vehicules(props: {
  params: Promise<{
    id: string;
  }>;
}) {
  const id = await (await props.params).id
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1>VEHICULES <strong>{id}</strong></h1>
        <div className="flex justify-center items-center border p-10 hover:cursor-pointer">
          
        </div>
      </main>
    </div>
  );
}
