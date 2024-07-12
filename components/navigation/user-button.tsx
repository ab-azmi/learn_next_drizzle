"use client"

import { Session } from "next-auth"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import Image from "next/image"
import { LogOut, Moon, Settings, Sun, TruckIcon } from "lucide-react"
import { signOut } from "@/server/auth"
import { useTheme } from "next-themes"
import React, { useEffect, useState } from "react"
import { Switch } from "../ui/switch"

export const UserButton = ({ user }: Session) => {
    const { setTheme, theme } = useTheme();
    const [checked, setChecked] = useState(theme === "dark");

    const setSwitchState = () => {
        switch (theme) {
            case "dark":
                setTheme("light");
                break;
            case "light":
                setTheme("dark");
                break;
            case "system":
                setTheme("system");
                break;
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    {user?.image && (
                        <AvatarImage alt={user.name!} src={user.image} width={32} />
                    )}
                    {!user?.image && (
                        <AvatarFallback className="bg-primary/25">
                            <div className="font-bold">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                        </AvatarFallback>
                    )}
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-4" align="end">
                <div className="bg-primary/15 rounded-md p-3 flex flex-col justify-center items-center gap-1 mb-2">
                    {user?.image && (
                        <Image alt={user.name!} src={user.image} width={32} height={32} className="rounded-full" />
                    )}

                    <h1 className="text-xs font-bold">{user?.name}</h1>
                    <p className="text-xs">{user?.email}</p>
                </div>
                <DropdownMenuItem className="py-2 font-medium cursor-pointer transition-all duration-300">
                    <TruckIcon size={16} className="mr-2" />
                    My Orders
                </DropdownMenuItem>
                <DropdownMenuItem className="py-2 font-medium cursor-pointer transition-all duration-300">
                    <Settings size={16} className="mr-2" />
                    Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="py-2 font-medium cursor-pointer transition-all duration-300">
                    {theme === "dark" && (
                        <Moon size={16} className="text-primary" />
                    )}
                    {theme === "light" && (
                        <Sun size={16} className="text-yellow-500" />
                    )}
                    <DropdownMenuLabel className="capitalize">
                        {theme == 'light' && (
                            <span className="text-yellow-500 font-medium">Light</span>
                        )}
                        {theme == 'dark' && (
                            <span className="text-primary font-medium">Light</span>
                        )}
                    </DropdownMenuLabel>
                    <Switch className="ml-2" checked={checked} onCheckedChange={(e) => {
                        setChecked((prev) => !prev);
                        if (e) {
                            setTheme("dark");
                        } else {
                            setTheme("light");
                        }
                    }} />
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-destructive focus:text-white font-medium" onClick={() => signOut()}>
                    <LogOut size={16} className="mr-2" />
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}