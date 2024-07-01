import { auth } from "@/server/auth"
import { UserButton } from "./user-button";
import { Button } from "../ui/button";
import Link from "next/link";
import { LogIn } from "lucide-react";

export default async function Nav() {
    const session = await auth();

    return (
        <header className="bg-slate-500 py-4">
            <nav>
                <ul className="flex justify-between">
                    <li>Logo</li>
                    {!session ? (
                        <li>
                            <Button asChild>
                                <Link href="/api/auth/signin"
                                    className="flex gap-2">
                                    <LogIn size={16}/>
                                    Sign in
                                </Link>
                            </Button>
                        </li>
                    ) : (
                    <li>
                        <UserButton expires={session?.expires} user={session?.user}/>
                    </li>
                    )}
                </ul>
            </nav>
        </header>
    )
}