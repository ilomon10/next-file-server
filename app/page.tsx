import { redirect } from "next/navigation";

export default async function Profile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  redirect("/ilomon10/tree");
}
