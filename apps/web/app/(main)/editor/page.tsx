import { checkJournalAccess } from "@/utils/check-shared";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import EditorComponent from "./editor";

async function EditorPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const entryId = (await searchParams).entryId;

  //if query parameter empty
  if (!entryId) return <EditorComponent />;

  //if query parameter is there but the user is not allowed to view the journal (journal is not shared with that user)
  const permissions = await checkJournalAccess(entryId);
  if (!permissions.isOwner && !permissions.isShared) {
    toast.error("You are not allowed to view this journal");
    setTimeout(() => {
      redirect("/journals");
    }, 1000);
    return <></>;
  }

  //user allowed to view the journal but whether allowed to edit or not needs to be checked
  // Get the cookies from the request
  const cookieStore = await cookies();
  // Make the API call with credentials and cookies
  const res = await fetch(`https://journ-novel.vercel.app/api/journal/${entryId}`, {
    headers: {
      Cookie: cookieStore.toString(), //since its a server to server request, we need to pass the cookies
    },
    credentials: "include",
  });

  const response = await res.json();
  console.log(response);
  return <EditorComponent journal={response.journal} allowEdit={permissions.allowEdit} />;
}

export default EditorPage;
