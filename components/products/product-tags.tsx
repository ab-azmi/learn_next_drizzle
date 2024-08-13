'use client'

import { cn } from "@/lib/utils"
import { Badge } from "../ui/badge"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation";

export default function ProductTags() {
    const router = useRouter();
    const params = useSearchParams();
    const tag = params.get('tag');

    const setFilter = (tag: string) => {
        if (tag) {
            router.push(`?tag=${tag}`)
        }
        if (!tag) {
            router.push('/')
        }
    }
    
    return (
        <div className="my-4 gap-4 flex items-center justify-center">
            <Badge
                onClick={() => setFilter('')}
                className={cn('cursor-pointer bg-secondary-foreground hover:opacity-100', !tag || tag === '' ? 'opacity-100' : 'opacity-50')}>
                All
            </Badge>
            <Badge
                onClick={() => setFilter('blue')}
                className={cn('cursor-pointer bg-blue-500 hover:opacity-100 hover:bg-blue-600', tag && tag === 'blue' ? 'opacity-100' : 'opacity-50')}>
                Blue
            </Badge>
            <Badge
                onClick={() => setFilter('green')}
                className={cn('cursor-pointer bg-green-500 hover:bg-green-600 hover:opacity-100', tag && tag === 'green' ? 'opacity-100' : 'opacity-50')}>
                Green
            </Badge>
            <Badge
                onClick={() => setFilter('purple')}
                className={cn('cursor-pointer bg-purple-500 hover:bg-purple-600 hover:opacity-100', tag && tag === 'purple' ? 'opacity-100' : 'opacity-50')}>
                Purple
            </Badge>
        </div>
    )
}