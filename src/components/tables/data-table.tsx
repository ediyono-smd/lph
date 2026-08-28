"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronLeft, ChevronRight, Inbox, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ColumnDef<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T, index: number) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  actionButton?: React.ReactNode;
  customFilter?: React.ReactNode;
  showRowNumbers?: boolean;
  page?: number;
  totalPages?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  totalItems?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  isLoading?: boolean;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  searchPlaceholder = "Cari data...",
  onSearch,
  actionButton,
  customFilter,
  showRowNumbers = true,
  page: controlledPage,
  totalPages: controlledTotalPages,
  pageSize: controlledPageSize,
  pageSizeOptions = [10, 25, 50, 100],
  totalItems: controlledTotalItems,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
}: DataTableProps<T>) {
  // Internal search state
  const [searchValue, setSearchValue] = useState("");

  // Internal client-side pagination state when not server-controlled
  const [internalPage, setInternalPage] = useState(1);
  const [internalPageSize, setInternalPageSize] = useState(10);

  const isServerControlled = typeof onPageChange === "function";

  // Effective page & page size
  const activePage = isServerControlled ? (controlledPage ?? 1) : internalPage;
  const activePageSize = isServerControlled ? (controlledPageSize ?? 10) : internalPageSize;

  // Filter data client-side if onSearch is not provided
  const filteredData = useMemo(() => {
    if (isServerControlled || onSearch || !searchValue.trim()) {
      return data;
    }
    const q = searchValue.toLowerCase();
    return data.filter((item: any) =>
      Object.values(item).some((val) =>
        String(val ?? "")
          .toLowerCase()
          .includes(q)
      )
    );
  }, [data, searchValue, onSearch, isServerControlled]);

  // Total items & pages computation
  const totalCount = isServerControlled
    ? (controlledTotalItems ?? data.length)
    : filteredData.length;

  const totalPages = isServerControlled
    ? (controlledTotalPages ?? Math.max(1, Math.ceil(totalCount / activePageSize)))
    : Math.max(1, Math.ceil(totalCount / activePageSize));

  // Reset page to 1 when search or data length changes
  useEffect(() => {
    if (!isServerControlled) {
      setInternalPage(1);
    }
  }, [searchValue, data.length, isServerControlled]);

  // Paginated data for client-side mode
  const displayData = useMemo(() => {
    if (isServerControlled) {
      return data;
    }
    const start = (activePage - 1) * activePageSize;
    return filteredData.slice(start, start + activePageSize);
  }, [filteredData, data, activePage, activePageSize, isServerControlled]);

  // Pagination Change Handlers
  const handlePageChange = (newPage: number) => {
    const validPage = Math.max(1, Math.min(newPage, totalPages));
    if (isServerControlled && onPageChange) {
      onPageChange(validPage);
    } else {
      setInternalPage(validPage);
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    if (isServerControlled && onPageSizeChange) {
      onPageSizeChange(newSize);
    } else {
      setInternalPageSize(newSize);
      setInternalPage(1);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(searchValue);
  };

  const handleClearSearch = () => {
    setSearchValue("");
    if (onSearch) onSearch("");
  };

  // Automatically prepend sequential "No." column if not already defined in columns
  const finalColumns: ColumnDef<T>[] = useMemo(() => {
    const hasNoCol = columns.some(
      (c) =>
        c.header.trim().toLowerCase() === "no." ||
        c.header.trim().toLowerCase() === "no" ||
        c.header.trim().toLowerCase() === "no urut"
    );
    if (hasNoCol || !showRowNumbers) return columns;

    const noColumn: ColumnDef<T> = {
      header: "No.",
      className: "w-12 text-center",
      cell: (_, rowIndex) => (
        <span className="font-mono text-slate-500 font-bold text-[11px] block text-center">
          {(activePage - 1) * activePageSize + rowIndex + 1}
        </span>
      ),
    };

    return [noColumn, ...columns];
  }, [columns, showRowNumbers, activePage, activePageSize]);

  const startItem = totalCount > 0 ? (activePage - 1) * activePageSize + 1 : 0;
  const endItem = Math.min(activePage * activePageSize, totalCount);

  return (
    /* Single Unified Container Card: Filters + Striped Table + Working Pagination */
    <div className="rounded-2xl border border-[#ebd7ba]/90 bg-white shadow-sm overflow-hidden">
      {/* 1. Integrated Toolbar Header (Zero Gap) */}
      {(onSearch || customFilter || actionButton || !isServerControlled) && (
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2 p-2.5 border-b border-[#ebd7ba]/80 bg-white">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[220px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#b87d28]" />
              <Input
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  if (onSearch) onSearch(e.target.value);
                }}
                className="pl-8 pr-7 h-8 text-xs rounded-xl border-[#ebd7ba] bg-[#fcfaf6] focus-visible:ring-1 focus-visible:ring-[#e5a952]"
              />
              {searchValue && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </form>

            {customFilter && <div className="flex flex-wrap items-center gap-2">{customFilter}</div>}
          </div>

          {actionButton && <div className="shrink-0">{actionButton}</div>}
        </div>
      )}

      {/* 2. Striped Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-[#f7f2e8] border-b border-[#ebd7ba]">
            <TableRow className="border-b border-[#ebd7ba]">
              {finalColumns.map((col, idx) => (
                <TableHead
                  key={idx}
                  className={`text-[11px] font-extrabold text-slate-900 uppercase tracking-wider py-2.5 px-3 ${col.className || ""}`}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={finalColumns.length}
                  className="h-28 text-center text-slate-500 bg-white"
                >
                  <div className="flex flex-col items-center justify-center space-y-1.5">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#073b2d] border-t-transparent" />
                    <span className="text-xs font-semibold text-slate-600">Memuat data...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : displayData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={finalColumns.length}
                  className="h-32 text-center text-slate-500 bg-white"
                >
                  <div className="flex flex-col items-center justify-center space-y-1">
                    <div className="h-8 w-8 rounded-xl bg-[#fbf5eb] flex items-center justify-center text-[#b87d28]">
                      <Inbox className="h-4 w-4" />
                    </div>
                    <p className="text-xs font-bold text-slate-800">
                      Tidak ada data yang ditemukan
                    </p>
                    <p className="text-[11px] text-slate-400 font-normal">
                      Coba sesuaikan kata kunci pencarian atau filter yang dipilih.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              displayData.map((item, rowIndex) => (
                <TableRow
                  key={item.id}
                  className={cn(
                    "border-b border-[#ebd7ba]/40 transition-colors",
                    rowIndex % 2 === 1 ? "bg-[#fbf9f3]" : "bg-white",
                    "hover:bg-[#f6eee0]"
                  )}
                >
                  {finalColumns.map((col, idx) => (
                    <TableCell key={idx} className={`py-2 px-3 ${col.className || ""}`}>
                      {col.cell
                        ? col.cell(item, rowIndex)
                        : col.accessorKey
                        ? String(item[col.accessorKey] ?? "-")
                        : "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 3. Integrated Universal Working Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-slate-600 px-3 py-2 border-t border-[#ebd7ba]/80 bg-[#fcfaf6]">
        {/* Left: Page Size Selector (10, 25, 50, 100) & Record Stats */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-slate-600">Tampilkan:</span>
            <select
              value={activePageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="h-7 px-1.5 rounded-lg border border-[#ebd7ba] bg-white text-xs font-bold text-slate-900 shadow-sm focus:outline-none focus:ring-1 focus:ring-[#e5a952] cursor-pointer"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <span className="text-[11px] text-slate-600 font-medium">
            Menampilkan <strong className="text-slate-900">{startItem}</strong> -{" "}
            <strong className="text-slate-900">{endItem}</strong> dari{" "}
            <strong className="text-slate-900">{totalCount}</strong> data
          </span>
        </div>

        {/* Right: Working Pagination Navigation (Previous / Next) */}
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="outline"
            disabled={activePage <= 1 || isLoading}
            onClick={() => handlePageChange(activePage - 1)}
            className="h-7 px-2.5 text-xs rounded-xl border-[#ebd7ba] bg-white hover:bg-[#fbf5eb] disabled:opacity-40 font-bold text-slate-700 shadow-xs cursor-pointer"
          >
            <ChevronLeft className="h-3.5 w-3.5 mr-0.5 text-[#b87d28]" />
            Sebelumnya
          </Button>

          <span className="px-2 py-0.5 font-bold text-[11px] text-[#073b2d] bg-[#fbf5eb] border border-[#ebd7ba] rounded-lg">
            Halaman {activePage} / {Math.max(totalPages, 1)}
          </span>

          <Button
            size="sm"
            variant="outline"
            disabled={activePage >= totalPages || isLoading}
            onClick={() => handlePageChange(activePage + 1)}
            className="h-7 px-2.5 text-xs rounded-xl border-[#ebd7ba] bg-white hover:bg-[#fbf5eb] disabled:opacity-40 font-bold text-slate-700 shadow-xs cursor-pointer"
          >
            Selanjutnya
            <ChevronRight className="h-3.5 w-3.5 ml-0.5 text-[#b87d28]" />
          </Button>
        </div>
      </div>
    </div>
  );
}
