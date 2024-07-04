import { AlertCircle } from "lucide-react";

const FormError = ({ message }: {message?: string}) => {
    if (!message) return null;

    return (
        <div className="items-center flex gap-3 bg-destructive/25 text-secondary-foreground p-3 rounded-md">
            <AlertCircle className="w-4 h-4"/>
            <p>{message}</p>
        </div>
    )
};

export default FormError;