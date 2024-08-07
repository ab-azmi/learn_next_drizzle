'use client'

import { ProductWithVariants, VariantsWithProduct } from "@/lib/infer-types";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "../ui/carousel";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Autoplay from "embla-carousel-autoplay"

export default function ProductShowcase({ variants }: { variants: VariantsWithProduct[] }) {
    const [api, setApi] = useState<CarouselApi>()
    const [activeThumbnail, setActiveThumbnail] = useState([0])
    const searchParams = useSearchParams();
    const selectedColor = searchParams.get('type') || variants[0].productType;

    const updatePreview = (index: number) => {
        api?.scrollTo(index);
    }

    useEffect(() => {
        if (!api) {
            return
        }

        api.on('slidesInView', (e) => {
            setActiveThumbnail(e.slidesInView())
        })
    }, [api])

    return (
        <Carousel
            plugins={[
                Autoplay({
                    delay: 3000,
                }),
            ]}
            setApi={setApi}
            opts={{ loop: true, }}>
            <CarouselContent>
                {variants.map(vari => vari.productType === selectedColor && vari.variantImages.map((img, index) => {
                    return (
                        <CarouselItem key={img.url}>
                            {img.url ? (
                                <Image
                                    priority
                                    className="rounded-md h-auto w-auto"
                                    width={1200}
                                    height={720}
                                    src={img.url}
                                    alt={img.name} />
                            ) : null}
                        </CarouselItem>
                    )
                }))}
            </CarouselContent>
            <div className="flex overflow-clip py-2 gap-4">
                {variants.map(vari => vari.productType === selectedColor && vari.variantImages.map((img, index) => {
                    return (
                        <div
                            key={img.url}>
                            {img.url ? (
                                <Image
                                    onClick={() => updatePreview(index)}
                                    priority
                                    className={cn('rounded-md transition-all duration-300 ease-in-out cursor-pointer hover:opacity-75 h-auto w-auto', index === activeThumbnail[0] ? 'opacity-100' : 'opacity-50')}
                                    width={72}
                                    height={48}
                                    src={img.url}
                                    alt={img.name} />
                            ) : null}
                        </div>
                    )
                }))}
            </div>
        </Carousel>
    )
}