'use client'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"
import { useMemo } from "react";

export default function BreadcrumbNavigation() {

    const pathname = usePathname();

    function sanitizePathname(pn: string) {
        const parts = pn.split('/').filter(Boolean);
        return parts.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' / ');
    }

    const pn = useMemo(() => {
        return sanitizePathname(pathname);
    }, [pathname])

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="dashboard">
                        Dashboard
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {pn !== 'Dashboard' &&
                    <>
                        <BreadcrumbSeparator className="hidden md:block" />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{pn}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </>
                }
            </BreadcrumbList>
        </Breadcrumb>
    )
}