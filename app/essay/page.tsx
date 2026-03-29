import { getEssayEntries } from "@/lib/content";
import EssayJournal from "@/components/EssayJournal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Essay"
};

export default function EssayPage() {
  const entries = getEssayEntries();

  return (
    <div className="flex flex-col gap-10 py-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Essay</h1>
        <p className="text-default-500 text-base">
          记录思考，和当下的自己对话。
        </p>
      </div>

      <EssayJournal entries={entries} />
    </div>
  );
}
