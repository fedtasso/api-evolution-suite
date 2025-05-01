export const capitalizeText = (text) => {
    return text
        .toLowerCase() // Asegura que todo el texto esté en minúsculas
        .split(' ') // Divide el texto en palabras
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitaliza cada palabra
        .join(' '); // Une las palabras nuevamente en una sola cadena
};