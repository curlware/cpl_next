'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface DataTableProps<T> {
  data: T[]
  columns: Array<{
    header: string
    accessorKey: ((row: T) => React.ReactNode) | string
  }>
  searchable?: boolean
  pagination?: boolean
  pageSize?: number
  onRowClick?: (item: T) => void
}

export function DataTable<T>({
  data = [],
  columns = [],
  searchable = false,
  pagination = false,
  pageSize = 10,
  onRowClick
}: DataTableProps<T>) {
  const [filteredData, setFilteredData] = useState<T[]>(data)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Update filtered data when data or search term changes
  useEffect(() => {
    if (!searchTerm) {
      setFilteredData(data)
    } else {
      const lowercasedFilter = searchTerm.toLowerCase()
      const filtered = data.filter((item: any) => {
        return Object.keys(item).some((key) => {
          // Skip if the value is non-primitive
          if (typeof item[key] === 'object' || Array.isArray(item[key])) return false

          // Check if the string contains the filter term
          return String(item[key]).toLowerCase().includes(lowercasedFilter)
        })
      })
      setFilteredData(filtered)
    }

    // Reset to first page when data or search changes
    setCurrentPage(1)
  }, [data, searchTerm])

  // Calculate total pages
  useEffect(() => {
    setTotalPages(Math.ceil(filteredData.length / pageSize))
  }, [filteredData, pageSize])

  // Get data for the current page
  const getCurrentPageData = () => {
    if (!pagination) return filteredData

    const startIndex = (currentPage - 1) * pageSize
    return filteredData.slice(startIndex, startIndex + pageSize)
  }

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  return (
    <div className='space-y-4'>
      {searchable && (
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            placeholder='Search...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='pl-10 pr-10'
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
            >
              <X className='h-4 w-4' />
            </button>
          )}
        </div>
      )}

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {getCurrentPageData().length > 0 ? (
              getCurrentPageData().map((row: any, rowIdx) => (
                <TableRow
                  key={rowIdx}
                  className={onRowClick ? 'cursor-pointer hover:bg-muted' : ''}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((column, colIdx) => (
                    <TableCell key={`${rowIdx}-${colIdx}`}>
                      {typeof column.accessorKey === 'function'
                        ? column.accessorKey(row)
                        : typeof column.accessorKey === 'string'
                          ? String(row[column.accessorKey] ?? '')
                          : ''}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && totalPages > 1 && (
        <div className='flex items-center justify-between'>
          <p className='text-sm text-muted-foreground'>
            Showing {getCurrentPageData().length} of {filteredData.length} items
          </p>
          <div className='flex items-center space-x-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className='h-4 w-4' />
            </Button>
            <span className='text-sm'>
              {currentPage} of {totalPages}
            </span>
            <Button
              variant='outline'
              size='sm'
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
            >
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
