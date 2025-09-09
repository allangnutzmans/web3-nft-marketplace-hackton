'use client'

import { Search, MessageCircle, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const navigationItems = [
  { name: "Collectibles", active: true },
  { name: "Art", active: false },
  { name: "Sports", active: false },
  { name: "Gaming", active: false },
  { name: "Utility", active: false },
  { name: "Cards", active: false },
]

export default function Header() {
  return (
    <header className="w-full bg-white ps-4 pe-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">1</span>
            </div>
            <span className="font-bold text-xl">NFT</span>
          </div>
          
          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Button
                key={item.name}
                variant={item.active ? "default" : "ghost"}
                className={`px-4 py-2 rounded-full ${
                  item.active 
                    ? "bg-black text-white hover:bg-gray-800" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {item.name}
              </Button>
            ))}
          </nav>
        </div>

        {/* Search and Actions */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 w-64 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          {/* Message Icon with Badge */}
          <div className="relative">
            <Button variant="ghost" size="icon" className="relative">
              <MessageCircle className="w-5 h-5 text-gray-600" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-pink-500 text-white text-xs flex items-center justify-center p-0">
                1
              </Badge>
            </Button>
          </div>

          {/* User Avatar */}
          <Button variant="ghost" size="icon">
            <User className="w-5 h-5 text-gray-600" />
          </Button>
        </div>
      </div>
    </header>
  )
}
