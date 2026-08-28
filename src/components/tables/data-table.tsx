"use client";

import React, { useState } from "react";
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
  page = 1,
  totalPages = 1,
  pageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  totalItems,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
}: DataTableProps<T>) {
  const [searchValue, setSearchValue] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(searchValue);
  };

  const handleClearSearch = () => {
    setSearchValue("");
    if (onSearch) onSearch("");
  };

  const startItem = totalItems && totalItems > 0 ? (page - 1) * pageSize + 1 : 0;
  const endItem = totalItems ? Math.min(page * pageSize, totalItems) : data.length;

  return (
    /* Single Unified Container Card: Filters + Striped Table + Server Pagination */
    <div className="rounded-2xl border border-[#ebd7ba]/90 bg-white shadow-sm overflow-hidden">
      {/* 1. Integrated Toolbar Header (Zero Gap) */}
      {(onSearch || customFilter || actionButton) && (
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2 p-2.5 border-b border-[#ebd7ba]/80 bg-white">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            {onSearch && (
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
            )}

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
              {columns.map((col, idx) => (
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
                  colSpan={columns.length}
                  className="h-28 text-center text-slate-500 bg-white"
                >
                  <div className="flex flex-col items-center justify-center space-y-1.5">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#073b2d] border-t-transparent" />
                    <span className="text-xs font-semibold text-slate-600">Memuat data pengajuan...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
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
              data.map((item, rowIndex) => (
                <TableRow
                  key={item.id}
                  className={cn(
                    "border-b border-[#ebd7ba]/40 transition-colors",
                    rowIndex % 2 === 1 ? "bg-[#fbf9f3]" : "bg-white",
                    "hover:bg-[#f6eee0]"
                  )}
                >
                  {columns.map((col, idx) => (
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

      {/* 3. Integrated Server Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-slate-600 px-3 py-2 border-t border-[#ebd7ba]/80 bg-[#fcfaf6]">
        {/* Left: Page Size Selector & Record Stats */}
        <div className="flex items-center gap-2.5">
          {onPageSizeChange && (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium text-slate-600">Tampilkan:</span>
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="h-7 px-1.5 rounded-lg border border-[#ebd7ba] bg-white text-xs font-bold text-slate-900 shadow-sm focus:outline-none focus:ring-1 focus:ring-[#e5a952]"
              >
                {pageSizeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <span className="text-[11px] font-medium text-slate-600">per halaman</span>
            </div>
          )}

          {typeof totalItems === "number" && (
            <span className="text-[11px] text-slate-500 font-normal hidden md:inline border-l border-[#ebd7ba] pl-2.5">
              Menampilkan <strong>{startItem}</strong> - <strong>{endItem}</strong> dari <strong>{totalItems}</strong> data
            </span>
          )}
        </div>

        {/* Right: Page Navigation Buttons */}
        <div className="flex items-center space-x-1.5">
          <span className="text-xs font-semibold text-slate-700 mr-1">
            Hal <strong className="text-slate-900">{page}</strong> dari <strong className="text-slate-900">{totalPages}</strong>
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange && onPageChange(page - 1)}
            disabled={page <= 1 || isLoading}
            className="h-7 px-2.5 rounded-lg border-[#ebd7ba] bg-white hover:bg-[#fbf5eb] text-xs font-bold shadow-sm"
          >
            <ChevronLeft className="h-3 w-3 mr-1" />
            Sebelumnya
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange && onPageChange(page + 1)}
            disabled={page >= totalPages || isLoading}
            className="h-7 px-2.5 rounded-lg border-[#ebd7ba] bg-white hover:bg-[#fbf5eb] text-xs font-bold shadow-sm"
          >
            Selanjutnya
            <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
