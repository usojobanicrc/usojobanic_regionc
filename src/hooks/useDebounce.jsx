// src/hooks/useDebounce.js

import { useState, useEffect } from 'react';

/**
 * Hook para retrasar la actualización de un valor.
 * Útil para búsquedas y filtros para evitar llamar a APIs en cada pulsación de tecla.
 * @param {any} value - El valor que debe ser retrasado (activeFilters).
 * @param {number} delay - El tiempo de retardo en milisegundos (ej: 300).
 * @returns {any} El valor retrasado.
 */
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // 1. Configurar un temporizador para actualizar el valor después del retraso
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // 2. Limpiar/Reiniciar el temporizador si el valor cambia antes de que expire el retraso
        return () => {
            clearTimeout(handler);
        };
    },
        [value, delay]); // Solo re-ejecutar si el valor o el retraso cambian

    return debouncedValue;
}

export default useDebounce;