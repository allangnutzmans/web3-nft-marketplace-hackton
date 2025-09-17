'use client'

import { Filter, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="w-full bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Filters */}
        <div className="flex items-center space-x-1">
          <Button variant="ghost" className="flex items-center space-x-2 px-4 py-2 rounded-lg">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </Button>
          <div className="w-0.5 h-6 bg-gray-200"></div>
          <Button variant="ghost" className="flex items-center space-x-2 px-4 py-2 rounded-lg">
            <span>Popular</span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>

        {/* Pagination */}
        <div className="flex items-center space-x-2">
          <span className="text-gray-600 font-medium">05/100</span>
          <div className="w-8 h-0.5 bg-black rounded-full"></div>
        </div>
      </div>
    </footer>
  )
}
