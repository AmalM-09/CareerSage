import React from 'react'
import {SignInButton,SignUpButton,UserButton,SignedIn,SignedOut} from "@clerk/nextjs";
import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/button';
import { ChevronDown, FileText, LayoutDashboard, StarsIcon } from 'lucide-react';
import { DropdownMenu,DropdownMenuTrigger,DropdownMenuContent,DropdownMenuItem,DropdownMenuLabel,DropdownMenuSeparator } from "./ui/dropdown-menu";
import {checkUser} from "@/lib/checkUser";

const Header = async() => {
  
  await checkUser();

  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60">
      <nav className='container mx-auto px-4 h-16 flex items-center justify-between'>
        <Link href='/'>
          <Image src="/Career_Sage_logo.jpg" alt='Career Sage' width={200} height={60} className="h-12 w-12 object-contain rounded-full"/> 
        </Link>
        <div className='flex items-center space-x-2 space-x-4'>
          <SignedIn>
            <Link href={"/dashboard"}>
              <Button variant="outline">
                <LayoutDashboard className="h-4 w-4"/>
                <span className='hidden md:block'> Industry Insights </span>
              </Button>
            </Link>
    
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <StarsIcon className = "h-4 w-4"/>
                  <span className='hidden md:block'> Growth Tools </span>
                  <ChevronDown className="h-4 w-4"/>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href={"/resume"} className='flex items-center gap-3'> 
                    <FileText className='h-4 w-4' />
                      <span> Build Resume </span>
                  </Link>
                </DropdownMenuItem>
                {/* <DropdownMenuItem>
                  <Link href={"/interview"} className='flex items-center gap-3'> 
                    <FileText className='h-4 w-4'/>
                      <span> interview </span>
                  </Link>
                </DropdownMenuItem> */}
                <DropdownMenuItem>
                  <Link href={"/guid"} className='flex items-center gap-3'> 
                    <FileText className='h-4 w-4'/>
                      <span> Guidness </span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </SignedIn>

          <SignedOut>
            <SignInButton>
              <Button variant="outline"> Sign In </Button>
            </SignInButton> 
          </SignedOut>

          <SignedIn>
            <UserButton 
              appearance={{
                elements:{
                 avatarBox: "w-20 h-20",
                  userButtonPopoverCard:"shadow-xl",
                  userPreviewMainIdentifier: "font-semibold",
                },
              }}
              afterSignOutUrl='/'
            />
          </SignedIn>

        </div>
      </nav>
    </header>
  )
}

export default Header;