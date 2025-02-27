import { auth } from "@/auth";
import { getUserIdByEmail } from "@/utils/fetch-user";
import { prisma } from "@repo/db";

/**
 * Check if a user can access a journal (either as owner or shared with them)
 * and return relevant permissions
 * @param journalId The ID of the journal to check
 * @returns Object containing access status and permissions
 */
export async function checkJournalAccess(journalId: string) {
  try {
    // Get the current user session
    const session = await auth();

    if (!session?.user?.email) {
      return {
        canAccess: false,
        isOwner: false,
        isShared: false,
        allowEdit: false,
        allowViewAnalysis: false,
        error: "User not authenticated",
      };
    }

    // Get the current user ID
    const userId = await getUserIdByEmail(session.user.email);

    if (!userId) {
      return {
        canAccess: false,
        isOwner: false,
        isShared: false,
        allowEdit: false,
        allowViewAnalysis: false,
        error: "User ID not found",
      };
    }

    // First check if the user is the owner of the journal
    const journal = await prisma.journalEntry.findUnique({
      where: {
        id: journalId,
      },
      select: {
        userId: true,
      },
    });

    if (journal && journal.userId === userId) {
      return {
        canAccess: true,
        isOwner: true,
        isShared: false,
        allowEdit: true,
        allowViewAnalysis: true,
      };
    }

    // If not owner, check if the journal is shared with this user
    const journalShare = await prisma.journalShare.findUnique({
      where: {
        journalId_sharedWithUserId: {
          journalId: journalId,
          sharedWithUserId: userId,
        },
      },
      select: {
        allowEdit: true,
        allowViewAnalysis: true,
      },
    });

    if (!journalShare) {
      return {
        canAccess: false,
        isOwner: false,
        isShared: false,
        allowEdit: false,
        allowViewAnalysis: false,
      };
    }

    // Return the sharing status and permissions
    return {
      canAccess: true,
      isOwner: false,
      isShared: true,
      allowEdit: journalShare.allowEdit,
      allowViewAnalysis: journalShare.allowViewAnalysis,
    };
  } catch (error) {
    console.error("Error checking journal access:", error);
    return {
      canAccess: false,
      isOwner: false,
      isShared: false,
      allowEdit: false,
      allowViewAnalysis: false,
      error: "Failed to check journal access",
    };
  }
}
