import { getEssayEntries } from "@/lib/content";
import EssayJournal from "@/components/EssayJournal";
import SplitText from "@/components/react-bits/SplitText";
import dayjs from "@/lib/dayjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Essay"
};

export default function EssayPage() {
  const entries = getEssayEntries();
  const latest = entries[0];
  const latestDate = latest ? dayjs(latest.date).format("YYYY年M月D日") : "暂无";
  const yearCount = new Set(entries.map((entry) => dayjs(entry.date).year())).size;

  return (
    <div className="flex flex-col gap-10 py-6">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            <SplitText text="Essay" delayStep={30} />
          </h1>
          <p className="text-default-500 text-base">
            记录思考，和当下的自己对话。
          </p>
        </div>

        <div className="grid grid-cols-3 overflow-hidden rounded-2xl surface">
          <JournalStat label="Entries" value={entries.length.toString()} />
          <JournalStat label="Years" value={yearCount.toString()} />
          <JournalStat label="Latest" value={latestDate} />
        </div>
      </div>

      <EssayJournal entries={entries} />
    </div>
  );
}

function JournalStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 px-4 py-3 sm:px-5 border-r border-black/[0.04] last:border-r-0 dark:border-white/[0.06]">
      <span className="text-[11px] uppercase tracking-[0.14em] text-zinc-400 dark:text-zinc-500">
        {label}
      </span>
      <span className="text-sm sm:text-base font-semibold text-zinc-800 dark:text-zinc-100 truncate">
        {value}
      </span>
    </div>
  );
}
