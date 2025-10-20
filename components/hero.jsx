import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import Image from 'next/image'




const HeroSection = () => {
  return (
    <section className='w-full pt-36 md:pt-48 pb-10'>
        <div className='space-y-6 text-center'>
            <div className='space-y-6 mx-auto'>
               <h1 className="text-5xl md:text-7xl lg:text-7xl xl:text-8xl gradient gradient-title">
                    Your AI career coach for
                    <br />
                   professional success
                </h1>
                <p className='mx-auto max-w-[600px] text-muted-foreground md:text-xl'>
                  Advance professionally with expert guidance, interview support, and 
                  AI tools designed for your success.
                </p>
            </div>
            <div className='flex justify-center space-x-4'>
                <Link href='/dashboard'>
                    <Button size='lg' className='px-8'>
                        Get Started
                    </Button>
                </Link>
                <Link href=''>
                    <Button size='lg' className='px-8' variant='outline'>
                        Get Started
                    </Button>
                </Link>    
            </div>
            <div className='hero-image-wrapper mt-5 md:mt-0'>
                <div>
                  {/* <Image 
                    src={"/image.png"}
                    width={1280}
                    height={720}
                    alt="BAnner **"
                    className='rounded-lg shadow-2xl border mx-auto'
                    priority
                  /> */}
                 
                </div>
            </div>
        </div>
    </section>
  )
}

export default HeroSection