'use client'

import { Search, MessageCircle, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { api } from "@/lib/trpc"
import { usePathname } from "next/navigation"

const navigationItems = [
  { name: "Collectibles", href: "/" },
  { name: "My Purchases", href: "/my-purchases" },
  { name: "My NFTs", href: "/my-nfts" },
];


export default function Header() {
  const { data: pendingPurchases } = api.purchase.getPendingPurchases.useQuery();
  const pendingCount = pendingPurchases?.length || 0;
  const pathname = usePathname();

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
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`px-4 py-2 rounded-full ${
                      isActive 
                        ? "bg-black text-white hover:bg-gray-800" 
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    {item.name}
                  </Button>
                </Link>
              );
            })}
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

          {/* Admin Space */}
          <Link href="/admin/purchases">
            <Button variant="ghost" size="icon" className="relative">
              <Settings className="w-5 h-5 text-gray-600" />
              {pendingCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center p-0">
                  {pendingCount}
                </Badge>
              )}
            </Button>
          </Link>

          {/* User Avatar */}
          <Button variant="ghost" size="icon">
            <User className="w-5 h-5 text-gray-600" />
          </Button>
        </div>
      </div>
    </header>
  )
}
