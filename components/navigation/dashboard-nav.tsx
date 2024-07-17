"use client";

import Link from "next/link";
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

type LinkType = {
    allLinks: {
        label: string;
        path: string;
        icon: React.ReactNode;
    }[];
};

export default function DashboardNav({ allLinks }: LinkType) {
    const pathname = usePathname();

    return (
        <nav className="py-2 px-6 overflow-x-auto">
            <ul className="flex gap-6 text-xs font-bold">
                <AnimatePresence>
                    {allLinks.map(link => (
                        <motion.li whileTap={{ scale: 0.95 }} key={link.path}>
                            <Link className={cn('flex gap-1 flex-col items-center relative', pathname === link.path ? 'text-primary' : '')} href={link.path}>
                                {link.icon}
                                {link.label}
                                {pathname === link.path && (
                                    <motion.div
                                        initial={{ scale: .8 }}
                                        animate={{ scale: 1 }}
                                        layoutId="underline"
                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                        className="h-[3px] rounded-full w-full absolute bg-primary z-0 left-0 -bottom-1" />
                                )}
                            </Link>
                        </motion.li>
                    ))}
                </AnimatePresence>
            </ul>
        </nav>
    )
}