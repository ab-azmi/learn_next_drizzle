import { CheckCircle } from "lucide-react";

const FormSuccess = ({ message }: {message?: string}) => {
    if (!message) return null;

    return (
        <div className="bg-teal-500 text-secondary-foreground p-3 rounded-md">
            <CheckCircle className="w-4 h-4"/>
            <p>{message}</p>
        </div>
    )
};

export default FormSuccess;