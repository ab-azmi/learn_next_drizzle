import { auth } from "@/server/auth"
import { UserButton } from "./user-button";
import { Button } from "../ui/button";
import Link from "next/link";
import { LogIn } from "lucide-react";
import Logo from "./logo";

export default async function Nav() {
    const session = await auth();

    return (
        <header className="px-14 py-8">
            <nav>
                <ul className="flex justify-between">
                    <li>
                        <Link href="/" aria-label="sprout and scribble logo">
                            <Logo />
                        </Link>
                    </li>
                    {!session ? (
                        <li>
                            <Button asChild>
                                <Link href="/auth/login"
                                    className="flex gap-2">
                                    <LogIn size={16} />
                                    Sign in
                                </Link>
                            </Button>
                        </li>
                    ) : (
                        <li>
                            <UserButton expires={session?.expires} user={session?.user} />
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    )
}