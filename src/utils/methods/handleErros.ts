import { AppError } from "~/services/error";

type HandleErrorProps = {
    location: string; 
    error: any;    
    errorMessage: string; 
    level?: "info" | "warn" | "error";
};

export default ({
    location,
    error,
    errorMessage,
    level = "error",
}: HandleErrorProps): never => {
    const logMessage = `[${location}]: ${errorMessage}`;

    // Registro según el nivel especificado
    switch (level) {
        case "info":
            console.info(logMessage, error);
            break;
        case "warn":
            console.warn(logMessage, error);
            break;
        case "error":
            console.error(logMessage, error);
            break;
        default:
            console.error(logMessage, error);
    }

    // Lanza un error personalizado
    throw new AppError(location, errorMessage, error);

};
