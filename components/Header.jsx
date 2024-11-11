'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Newspaper, Menu, Search, User, LogOut } from 'lucide-react'
import { useSession, signIn, signOut } from "next-auth/react"

export default function Header() {
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const { data: session } = useSession()

    const categories = [
        ['For You', '/categories/foryou'],
        ['Politics', '/categories/Politics'],
        ['Technology', '/categories/Technology'],
        ['Science', '/categories/Science'],
        ['Health', '/categories/Health'],
        ['Entertainment', '/categories/Entertainment'],
        ['Sports', '/categories/Sports'],
        ['Environment', '/categories/Environment'],
        ['Business', '/categories/Business'],
        ['Lifestyle', '/categories/Lifestyle'],
        ['Education', '/categories/Education'],
    ]

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setIsSearchOpen(false)
            }
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <header className='bg-white shadow-md sticky top-0 z-50'>
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <Newspaper className="h-8 w-8 text-primary" />
                        <span className="text-xl md:text-3xl font-bold text-gray-800">THE NEWSPAPER</span>
                    </Link>
                    <div className="flex items-center space-x-4">
                        <div className="hidden md:flex relative w-64">
                            <Input type="search" placeholder="Search news..." className="w-full pr-10" aria-label="Search news" />
                            <Button type="submit" size="icon" className="absolute right-0 top-0" aria-label="Perform search">
                                <Search className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex md:hidden">
                            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)} aria-label="Toggle search">
                                <Search className="h-6 w-6" />
                            </Button>
                        </div>
                        <div className="hidden sm:block">
                            {session ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
                                                <AvatarFallback>{session.user?.name?.[0] || 'U'}</AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="end" forceMount>
                                        <DropdownMenuItem asChild>
                                            <Link href="/profile" className="flex items-center">
                                                <User className="mr-2 h-4 w-4" />
                                                <span>Profile</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => signOut()}>
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Log out</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Button variant="outline" className="rounded-md" onClick={() => signIn("google")}>
                                    <User className="h-4 w-4 mr-2" />
                                    Login
                                </Button>
                            )}
                        </div>
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                                <nav className="flex flex-col space-y-4 mt-4">
                                    {categories.map(([name, path]) => (
                                        <Link key={path} href={path} className="text-gray-600 hover:text-primary">
                                            {name}
                                        </Link>
                                    ))}
                                    <div className="sm:hidden mt-4">
                                        {session ? (
                                            <>
                                                <Link href="/profile" className="flex items-center text-gray-600 hover:text-primary mb-2">
                                                    <User className="h-4 w-4 mr-2" />
                                                    Profile
                                                </Link>
                                                <Button variant="outline" className="w-full" onClick={() => signOut()}>
                                                    <LogOut className="h-4 w-4 mr-2" />
                                                    Logout
                                                </Button>
                                            </>
                                        ) : (
                                            <Button variant="outline" className="w-full" onClick={() => signIn("google")}>
                                                <User className="h-4 w-4 mr-2" />
                                                Login
                                            </Button>
                                        )}
                                    </div>
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
                {isSearchOpen && (
                    <div className="mt-4 md:hidden relative">
                        <Input type="search" placeholder="Search news..." className="w-full pr-10" aria-label="Search news" />
                        <Button type="submit" size="icon" className="absolute right-0 top-0" aria-label="Perform search">
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>
                )}
                <nav className="hidden md:flex flex-wrap justify-center w-full mt-4">
                    {categories.map(([name, path]) => (
                        <Link key={path} href={path} className="block py-2 mx-2 text-gray-600 hover:text-primary">
                            {name}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    )
}