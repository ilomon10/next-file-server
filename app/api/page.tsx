export default function ApiPage(props: {
  params: { folder: string[]; username: string };
  searchParams: {};
}) {
  const { username } = props.params;

  return (
    <>
      <main className="container px-4 mx-auto max-w-4xl mt-6"></main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </>
  );
}
