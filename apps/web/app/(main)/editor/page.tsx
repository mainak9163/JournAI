import { cookies } from "next/headers";
import EditorComponent from "./editor";

async function EditorPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const entryId = (await searchParams).entryId;
  if (!entryId) return <EditorComponent />;

  // Get the cookies from the request
  const cookieStore = cookies();

  // Make the API call with credentials and cookies
  const res = await fetch(`http://localhost:3000/api/journal/${entryId}`, {
    headers: {
      Cookie: cookieStore.toString(), //since its a server to server request, we need to pass the cookies
    },
    credentials: "include",
  });

  const response = await res.json();
  console.log(response);
  return <EditorComponent journal={response.journal} />;
}

export default EditorPage;
