'use client'

import { Home, Image, Lock, Star, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

const sidebarItems = [
  { icon: Home, active: true },
  { icon: Image, active: false },
  { icon: Lock, active: false },
  { icon: Star, active: false },
  { icon: User, active: false },
]

export default function Sidebar() {
  return (
    <aside className="w-16 bg-white flex flex-col items-center py-6 relative">
      {/* Navigation Items */}
      <div className="flex flex-col space-y-4 relative">
        {sidebarItems.map((item, index) => {
          const Icon = item.icon
          return (
            <div key={index} className="relative w-full flex justify-center">
              {/* Active indicator - vertical line */}
              {item.active && (
                <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 w-1 h-12 bg-primary rounded-r-full" />
              )}
              <Button
                variant="ghost"
                size="icon"
                className={`w-10 h-10 rounded-lg ${
                  item.active
                    ? "text-black hover:bg-gray-100"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5" />
              </Button>
            </div>
          )
        })}
      </div>

      {/* Settings at Bottom */}
      <div className="flex-1 flex flex-col justify-end">
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </aside>
  )
}
