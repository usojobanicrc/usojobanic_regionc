import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabaseClient';

// ---------------------------------------------------------
// LOG DE BITÁCORA
// ---------------------------------------------------------
const logActivity = async (actividad, tabla, lineaId) => {
    try {
        const { data: auth } = await supabase.auth.getUser();
        const email = auth?.user?.email;
        if (!email) return;

        const { data: perfil } = await supabase
            .from("usuarios")
            .select("id")
            .eq("correo", email)
            .single();

        await supabase.from("bitacora").insert([
            {
                usuario_id: perfil?.id,
                actividad,
                tabla_afectada: tabla,
                linea_id: lineaId
            }
        ]);
    } catch (err) {
        console.error("Error registrando en bitácora:", err);
    }
};

// ---------------------------------------------------------
// FUNCIÓN NUEVA PARA MANEJAR LA TABLA usuarios_roles
// ---------------------------------------------------------
const saveUserRole = async (usuarioId, rolId) => {
    try {
        // borrar el rol actual
        await supabase
            .from("usuarios_roles")
            .delete()
            .eq("usuario_id", usuarioId);

        // si no seleccionó rol, no insertamos nada
        if (!rolId) return;

        // insertar nuevo rol
        await supabase
            .from("usuarios_roles")
            .insert([
                { usuario_id: usuarioId, rol_id: Number(rolId) }
            ]);
    } catch (error) {
        console.error("Error guardando rol del usuario:", error);
    }
};

// ---------------------------------------------------------
// useCRUD + ajustes para roles
// --------------------------------------------------------
export const useCRUD = (tableName, relations = []) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const sanitizeRecord = (record) => {
        const sanitized = {};
        for (const key in record) {
            let value = record[key];

            // Evitar enviar rol_id a la tabla usuarios
            if (key === "rol_id") continue;

            // Evitar enviar la relación usuarios_roles (N:M)
            if (key === "usuarios_roles") continue;

            if (key === 'iglesias_estimadas' || key === 'iglesias_reales') continue;

            if (key.endsWith('_id')) {
                if (typeof value === "object" && value !== null) {
                    value = value.id ?? null;
                }
                if (value === '' || value === 'null' || value === null) value = null;
                else {
                    const num = Number(value);
                    value = isNaN(num) ? null : num;
                }
                sanitized[key] = value;
                continue;
            }

            if ((key.includes("fecha") || key.includes("registro")) && value === "") {
                sanitized[key] = null;
                continue;
            }

            if (["cantidad", "precio_compra"].includes(key)) {
                if (value === "" || value === null) {
                    sanitized[key] = null;
                } else {
                    const num = Number(value);
                    sanitized[key] = isNaN(num) ? null : num;
                }
                continue;
            }

            if ([
                'participantes_estimados',
                'participantes_reales',
                'presupuesto_estimado',
                'presupuesto_real'
            ].includes(key)) {
                if (value === '' || value === null || value === 'null') sanitized[key] = null;
                else {
                    const num = Number(value);
                    sanitized[key] = isNaN(num) ? null : num;
                }
                continue;
            }

            if ([
                'puntos_fuertes',
                'puntos_debiles',
                'sugerencias',
                'observaciones_planificacion',
                'motivo_cancelacion'
            ].includes(key)) {
                sanitized[key] = value === '' ? null : value;
                continue;
            }

            if (value === 'true') value = true;
            else if (value === 'false') value = false;
            else if (value === '') value = null;

            sanitized[key] = value;
        }
        return sanitized;
    };

    const manageEventosIglesias = async (eventoId, { iglesiasEstimadas = [], iglesiasReales = [] }) => {
        if (!eventoId) return false;

        await supabase.from('eventos_iglesias').delete().eq('evento_id', eventoId);

        const recordsToInsert = [
            ...iglesiasEstimadas.map(id => ({ evento_id: eventoId, iglesia_id: id, asistencia: 0 })),
            ...iglesiasReales.map(id => ({ evento_id: eventoId, iglesia_id: id, asistencia: 1 }))
        ];

        if (recordsToInsert.length > 0) {
            const { error } = await supabase.from('eventos_iglesias').insert(recordsToInsert);
            if (error) return false;
        }

        return true;
    };

    const fetchData = useCallback(async (currentFilters = {}) => {
        setLoading(true);
        setError(null);

        const relationsString = relations.length > 0 ? `, ${relations.join(', ')}` : '';
        const selectFields = `*${relationsString}`;

        let query = supabase.from(tableName).select(selectFields);

        Object.entries(currentFilters).forEach(([key, value]) => {
            if (value === null || value === '') return;

            const parts = key.split('_');
            const operator = parts.pop();
            const field = parts.join('_');

            switch (operator) {
                case 'ilike': query = query.ilike(field, `%${value}%`); break;
                case 'eq': query = query.eq(field, value); break;
                case 'gte': query = query.gte(field, value); break;
                case 'lte': query = query.lte(field, value); break;
                default: query = query.eq(field, value);
            }
        });

        const { data: records, error: fetchError } = await query;

        if (fetchError) {
            setError(fetchError);
            setData([]);
        } else {
            setData(records);
        }

        setLoading(false);
    }, [tableName, relations]);

    useEffect(() => {
        if (tableName) fetchData();
    }, [fetchData, tableName]);

    const createRecord = useCallback(async (newRecord, ntomRelations) => {
        setError(null);

        const sanitizedRecord = sanitizeRecord(newRecord);
        const { data: insertedData, error: insertError } = await supabase
            .from(tableName)
            .insert([sanitizedRecord])
            .select("id")
            .single();

        if (insertError) {
            setError(insertError);
            return { success: false, id: null };
        }

        const newId = insertedData.id;

        // guardar rol del usuario
        await saveUserRole(newId, newRecord.rol_id);

        await logActivity("CREACIÓN DE REGISTRO", tableName, newId);

        fetchData();
        return { success: true, id: newId };
    }, [tableName, relations, fetchData]);

    const updateRecord = useCallback(async (id, updatedFields, ntomRelations) => {
        setError(null);
        const recordId = Number(id);

        const sanitizedFields = sanitizeRecord(updatedFields);

        const { error: updateError } = await supabase
            .from(tableName)
            .update(sanitizedFields)
            .eq('id', recordId);

        if (updateError) {
            setError(updateError);
            return false;
        }

        // actualizar el rol del usuario
        await saveUserRole(recordId, updatedFields.rol_id);

        await logActivity("EDICIÓN DE REGISTRO", tableName, recordId);

        fetchData();
        return true;
    }, [tableName, relations, fetchData]);

    const deleteRecord = useCallback(async (id) => {
        setError(null);

        // borrar rol
        await supabase.from("usuarios_roles").delete().eq("usuario_id", id);

        const { error: deleteError } = await supabase
            .from(tableName)
            .delete()
            .eq('id', id);

        if (deleteError) {
            setError(deleteError);
            return false;
        }

        await logActivity("ELIMINACIÓN DE REGISTRO", tableName, id);

        fetchData();
        return true;
    }, [tableName, fetchData]);

    const getRecordById = useCallback(async (id) => {
        if (!id) return null;

        const relationsString = relations.length > 0 ? `, ${relations.join(', ')}` : '';
        const selectFields = `*${relationsString}`;

        const { data: record, error } = await supabase
            .from(tableName)
            .select(selectFields)
            .eq("id", id)
            .single();

        if (error) {
            console.error(`[CRUD ${tableName}] ❌ Error al obtener registro por ID:`, error);
            return null;
        }

        return record;
    }, [tableName, relations]);

    return {
        data,
        loading,
        error,
        fetchData,
        createRecord,
        updateRecord,
        deleteRecord,
        getRecordById
    };
};
