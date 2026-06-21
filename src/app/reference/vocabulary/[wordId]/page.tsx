import { notFound, redirect } from "next/navigation";
import { getAcademicById, getWordById } from "@/components/reference/ref-data";

/**
 * Legacy `/reference/vocabulary/[wordId]` route — redirects to the new
 * unified `/reference/word/[wordId]` or `/reference/academic/[wordId]`
 * routes introduced with the PR 99 redesign. Kept so external links and
 * existing bookmarks don't 404.
 */
export default async function LegacyVocabularyRoute({ params }: { params: Promise<{ wordId: string }> }) {
  const { wordId } = await params;
  if (getAcademicById(wordId)) redirect(`/reference/academic/${wordId}`);
  if (getWordById(wordId)) redirect(`/reference/word/${wordId}`);
  notFound();
}
