import { ReactNode } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Socials from "@/components/auth/socials";
import BackButton from "@/components/auth/back-button";

type CardWrapperProps = {
    children: ReactNode,
    cardTitle: string,
    backButtonHref: string,
    backButtonLabel: string,
    showSocials: boolean,
}

const AuthCard = ({
    children,
    cardTitle,
    backButtonHref,
    backButtonLabel,
    showSocials,
}: CardWrapperProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{cardTitle}</CardTitle>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
            {showSocials && (
                <CardFooter>
                    <Socials />
                </CardFooter>
            )}
            <CardFooter>
                <BackButton href={backButtonHref} label={backButtonLabel} />
            </CardFooter>
        </Card>
    )
};

export default AuthCard