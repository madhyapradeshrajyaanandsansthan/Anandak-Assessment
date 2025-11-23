
'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface AnandakLogoProps {
  size?: 'default' | 'small';
}

const AnandakLogo = ({ size = 'default' }: AnandakLogoProps) => {
  return (
    <div className={cn("flex items-start anandak-logo-container flex-nowrap", size === 'small' ? 'gap-2' : 'gap-2 sm:gap-4')}>
      <div data-ai-hint="logo government">
        <Image
          src="/mp-logo.svg"
          alt="Anandak Sansthan Logo"
          width={size === 'small' ? 48 : 64}
          height={size === 'small' ? 48 : 64}
          className="min-w-[40px]"
        />
      </div>
      <div>
        <h1 className={cn(
          "font-extrabold text-foreground font-headline tracking-tight leading-tight",
          size === 'small' ? 'text-lg' : 'text-xl sm:text-2xl md:text-3xl'
        )}>
          राज्य आनंद संस्थान
        </h1>
        <p className={cn(
          "font-normal text-muted-foreground font-headline leading-tight break-words",
          size === 'small' ? 'text-sm' : 'text-base sm:text-lg md:text-xl'
        )}>
          मध्यप्रदेश शासन
        </p>
      </div>
    </div>
  );
};

export default AnandakLogo;
