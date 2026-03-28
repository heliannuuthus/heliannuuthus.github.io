"use client";

import { Table as HeroTable } from "@heroui/react/table";
import type { ReactNode } from "react";

export default function Table({ children }: { children?: ReactNode }) {
  return (
    <HeroTable className="my-6">
      <HeroTable.ScrollContainer>
        <HeroTable.Content aria-label="table">{children}</HeroTable.Content>
      </HeroTable.ScrollContainer>
    </HeroTable>
  );
}

export const TableHeader = HeroTable.Header;
export const TableBody = HeroTable.Body;
export const TableColumn = HeroTable.Column;
export const TableRow = HeroTable.Row;
export const TableCell = HeroTable.Cell;
