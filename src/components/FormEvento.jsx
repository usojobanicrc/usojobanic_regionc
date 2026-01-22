// FormEvento.jsx — Versión FINAL integrada con AddEvento
import React, { useEffect, useState, useCallback } from "react";
import Select from "react-select";
import { supabase } from "../utils/supabaseClient";
import "../css/AddEvent.css"; // Usa el estilo hermoso
import { InputField } from "../components/InputField";
import { Button } from "../components/Button";
import { FaSave, FaTimes } from "react-icons/fa";

const FormEvento = ({
    initialData = {},
    onSubmit,
    onClose,
    createRecord,
    updateRecord,
    isEditing = false,
}) => {

    // ---------------------------
    // ESTADO INICIAL
    // ---------------------------
    const [form, setForm] = useState({
        titulo: "",
        lugar: "",
        url_lugar: "",
        tipo_evento_id: "",
        fecha_inicio: "",
        fecha_final: "",
        estado_evento: "Planificacion",
        participantes_estimados: 0,
        participantes_reales: 0,
        presupuesto_estimado: 0,
        presupuesto_real: 0,
        observaciones_planificacion: "",
        motivo_cancelacion: "",
        puntos_fuertes: "",
        puntos_debiles: "",
        sugerencias: "",
        iglesias_estimadas: [],
        iglesias_reales: [],
        evaluacion_id: null,
    });

    const [tiposEvento, setTiposEvento] = useState([]);
    const [iglesias, setIglesias] = useState([]);

    // -----------------------------------------------------------
    // 🔥 MAPEAR initialData → form (cuando editas)
    // -----------------------------------------------------------
    useEffect(() => {
        if (!initialData) return;

        const estimadas = [];
        const reales = [];

        if (initialData.eventos_iglesias?.length) {
            initialData.eventos_iglesias.forEach((i) => {
                if (i.asistencia === 0) estimadas.push(i.iglesia_id);
                if (i.asistencia === 1) reales.push(i.iglesia_id);
            });
        }

        const evalData =
            initialData.evaluaciones?.find(
                (e) => e.puntos_fuertes || e.puntos_debiles || e.sugerencias
            ) || initialData.evaluaciones?.[0] || {};

        setForm({
            titulo: initialData.titulo || "",
            lugar: initialData.lugar || "",
            url_lugar: initialData.url_lugar || "",
            tipo_evento_id:
                typeof initialData.tipo_evento_id === "object"
                    ? String(initialData.tipo_evento_id.id)
                    : String(initialData.tipo_evento_id || ""),
            fecha_inicio: initialData.fecha_inicio
                ? initialData.fecha_inicio.split("T")[0]
                : "",
            fecha_final: initialData.fecha_final
                ? initialData.fecha_final.split("T")[0]
                : "",
            estado_evento: initialData.estado_evento || "Planificacion",
            participantes_estimados: Number(initialData.participantes_estimados || 0),
            participantes_reales: Number(initialData.participantes_reales || 0),
            presupuesto_estimado: Number(initialData.presupuesto_estimado || 0),
            presupuesto_real: Number(initialData.presupuesto_real || 0),
            observaciones_planificacion: initialData.observaciones_planificacion || "",
            motivo_cancelacion: initialData.motivo_cancelacion || "",
            puntos_fuertes: evalData.puntos_fuertes || "",
            puntos_debiles: evalData.puntos_debiles || "",
            sugerencias: evalData.sugerencias || "",
            evaluacion_id: evalData.id || null,
            iglesias_estimadas: estimadas,
            iglesias_reales: reales,
        });
    }, [initialData]);

    // -----------------------------------------------------------
    // Cargar Tipos de evento
    // -----------------------------------------------------------
    useEffect(() => {
        const fetchTiposEvento = async () => {
            const { data, error } = await supabase
                .from("tipos_eventos")
                .select("id, descripcion");
            if (!error) setTiposEvento(data);
        };
        fetchTiposEvento();
    }, []);

    // -----------------------------------------------------------
    // Cargar Iglesias
    // -----------------------------------------------------------
    useEffect(() => {
        const fetchIglesias = async () => {
            const { data } = await supabase.from("iglesias").select("id, nombre");
            setIglesias(data || []);
        };
        fetchIglesias();
    }, []);

    // Helper react-select para multiselect
    const mapIglesiasToOptions = useCallback(
        (ids) => {
            if (!Array.isArray(ids)) return [];
            return ids
                .map((id) => {
                    const i = iglesias.find((x) => x.id === id);
                    return i ? { value: i.id, label: i.nombre } : null;
                })
                .filter(Boolean);
        },
        [iglesias]
    );

    // -----------------------------------------------------------
    // CAMBIO GENERAL DE INPUTS
    // -----------------------------------------------------------
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        let newValue = value;

        if (type === "number") {
            newValue = value === "" ? 0 : Number(value);
        }

        setForm((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    // react-select
    const handleSelectChange = (name, selectedOptions) => {
        const values = selectedOptions
            ? selectedOptions.map((opt) => Number(opt.value))
            : [];
        setForm((prev) => ({ ...prev, [name]: values }));
    };

    // -----------------------------------------------------------
    // SUBMIT (usa el CRUD genérico, NO se toca)
    // -----------------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();

        const eventPayload = {
            titulo: form.titulo,
            lugar: form.lugar,
            url_lugar: form.url_lugar,
            tipo_evento_id: Number(form.tipo_evento_id) || null,
            fecha_inicio: form.fecha_inicio || null,
            fecha_final: form.fecha_final || null,
            estado_evento: form.estado_evento,
            participantes_estimados: Number(form.participantes_estimados),
            participantes_reales: Number(form.participantes_reales),
            presupuesto_estimado: Number(form.presupuesto_estimado),
            presupuesto_real: Number(form.presupuesto_real),
            observaciones_planificacion: form.observaciones_planificacion || null,
            motivo_cancelacion: form.motivo_cancelacion || null,
        };

        const ntomRelations = {
            iglesiasEstimadas: form.iglesias_estimadas,
            iglesiasReales: form.iglesias_reales,
        };

        let success = false;
        let eventId = initialData?.id || null;

        if (isEditing && initialData?.id) {
            success = await updateRecord(initialData.id, eventPayload, ntomRelations);
            eventId = initialData.id;
        } else {
            const result = await createRecord(eventPayload, ntomRelations);
            success = result.success;
            eventId = result.id;
        }

        // Evaluación
        const evaluacionPayload = {
            puntos_fuertes: form.puntos_fuertes || null,
            puntos_debiles: form.puntos_debiles || null,
            sugerencias: form.sugerencias || null,
            evento_id: eventId,
        };

        if (isEditing && form.evaluacion_id) {
            await supabase
                .from("evaluaciones")
                .update(evaluacionPayload)
                .eq("id", form.evaluacion_id);
        } else {
            await supabase.from("evaluaciones").insert(evaluacionPayload);
        }

        if (success && onSubmit) onSubmit();
    };

    // -----------------------------------------------------------
    // 🔥 RENDER — estilo AddEvento completo
    // -----------------------------------------------------------
    return (
        <div className="ae-page">
            <div className="ae-container">
                <h2 className="ae-title">
                    {isEditing ? `Editar Evento: ${form.titulo}` : "Registrar Nuevo Evento"}
                </h2>

                <form className="ae-form" onSubmit={handleSubmit}>
                    {/* DATOS BÁSICOS */}
                    <div className="ae-section">
                        <div className="ae-section-header">
                            <h3>Datos Básicos</h3>
                        </div>

                        <div className="ae-field">
                            <label>Título del Evento</label>
                            <InputField
                                icon="bi bi-card-text"
                                name="titulo"
                                value={form.titulo}
                                onChange={handleChange}
                                label="Ingrese el título"
                                required
                            />
                        </div>

                        <div className="ae-field">
                            <label>Lugar</label>
                            <InputField
                                icon="bi bi-geo"
                                name="lugar"
                                value={form.lugar}
                                onChange={handleChange}
                                label="Nombre del lugar"
                            />
                        </div>

                        <div className="ae-field">
                            <label>URL del Lugar</label>
                            <InputField
                                icon="bi bi-link"
                                name="url_lugar"
                                value={form.url_lugar}
                                onChange={handleChange}
                                label="https://maps..."
                            />
                        </div>

                        <div className="ae-row">
                            <div className="ae-field">
                                <label>Tipo de Evento</label>
                                <select
                                    name="tipo_evento_id"
                                    value={form.tipo_evento_id}
                                    onChange={handleChange}
                                >
                                    <option value="">-- Seleccione --</option>
                                    {tiposEvento.map((t) => (
                                        <option key={t.id} value={String(t.id)}>
                                            {t.descripcion}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="ae-field">
                                <label>Estado del Evento</label>
                                <select
                                    name="estado_evento"
                                    value={form.estado_evento}
                                    onChange={handleChange}
                                >
                                    <option value="Planificacion">Planificación</option>
                                    <option value="Conclusion">Conclusión</option>
                                    <option value="Cancelado">Cancelado</option>
                                </select>
                            </div>
                        </div>

                        <div className="ae-row">
                            <div className="ae-field">
                                <label>Fecha Inicio</label>
                                <InputField
                                    icon="bi bi-calendar-date"
                                    type="date"
                                    name="fecha_inicio"
                                    value={form.fecha_inicio}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="ae-field">
                                <label>Fecha Final</label>
                                <InputField
                                    icon="bi bi-calendar-check"
                                    type="date"
                                    name="fecha_final"
                                    value={form.fecha_final}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN PLANIFICACIÓN */}
                    {form.estado_evento === "Planificacion" && (
                        <div className="ae-section section_planificacion">
                            <div className="ae-section-header">
                                <h3>Sección de Planificación</h3>
                            </div>

                            <div className="ae-field">
                                <label>Iglesias Estimadas</label>
                                <Select
                                    isMulti
                                    options={iglesias.map((i) => ({
                                        value: i.id,
                                        label: i.nombre,
                                    }))}
                                    value={mapIglesiasToOptions(form.iglesias_estimadas)}
                                    onChange={(opt) =>
                                        handleSelectChange("iglesias_estimadas", opt)
                                    }
                                />
                            </div>

                            <div className="ae-field">
                                <label>Participantes Estimados</label>
                                <InputField
                                    icon="bi bi-people"
                                    type="number"
                                    name="participantes_estimados"
                                    value={form.participantes_estimados}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="ae-field">
                                <label>Presupuesto Estimado</label>
                                <InputField
                                    icon="bi bi-cash-stack"
                                    type="number"
                                    step="0.01"
                                    name="presupuesto_estimado"
                                    value={form.presupuesto_estimado}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="ae-field">
                                <label>Observaciones de Planificación</label>
                                <InputField
                                    icon="bi bi-journal-text"
                                    name="observaciones_planificacion"
                                    value={form.observaciones_planificacion}
                                    onChange={handleChange}
                                    label="Notas o comentarios"
                                />
                            </div>
                        </div>
                    )}

                    {/* SECCIÓN CONCLUSIÓN */}
                    {form.estado_evento === "Conclusion" && (
                        <div className="ae-section section_conclusion">
                            <div className="ae-section-header">
                                <h3>Conclusión y Evaluación</h3>
                            </div>

                            <div className="ae-field">
                                <label>Iglesias Reales</label>
                                <Select
                                    isMulti
                                    options={iglesias.map((i) => ({
                                        value: i.id,
                                        label: i.nombre,
                                    }))}
                                    value={mapIglesiasToOptions(form.iglesias_reales)}
                                    onChange={(opt) =>
                                        handleSelectChange("iglesias_reales", opt)
                                    }
                                />
                            </div>

                            <div className="ae-field">
                                <label>Participantes Reales</label>
                                <InputField
                                    icon="bi bi-people"
                                    type="number"
                                    name="participantes_reales"
                                    value={form.participantes_reales}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="ae-field">
                                <label>Presupuesto Real</label>
                                <InputField
                                    icon="bi bi-cash"
                                    type="number"
                                    name="presupuesto_real"
                                    value={form.presupuesto_real}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="ae-field">
                                <label>Puntos Fuertes</label>
                                <InputField
                                    icon="bi bi-hand-thumbs-up"
                                    name="puntos_fuertes"
                                    value={form.puntos_fuertes}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="ae-field">
                                <label>Puntos Débiles</label>
                                <InputField
                                    icon="bi bi-hand-thumbs-down"
                                    name="puntos_debiles"
                                    value={form.puntos_debiles}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="ae-field">
                                <label>Sugerencias</label>
                                <InputField
                                    icon="bi bi-lightbulb"
                                    name="sugerencias"
                                    value={form.sugerencias}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    )}

                    {/* SECCIÓN CANCELADO */}
                    {form.estado_evento === "Cancelado" && (
                        <div className="ae-section section_cancelacion">
                            <div className="ae-section-header">
                                <h3>Motivo de Cancelación</h3>
                            </div>

                            <div className="ae-field">
                                <InputField
                                    icon="bi bi-x-circle"
                                    name="motivo_cancelacion"
                                    value={form.motivo_cancelacion}
                                    onChange={handleChange}
                                    label="Explique el motivo"
                                />
                            </div>
                        </div>
                    )}

                    {/* BOTONES */}
                    <div className="ae-form-buttons">
                        <Button
                            name="Cancelar"
                            className="btn-secondary"
                            onClick={onClose}
                            icon={<FaTimes />}
                        />

                        <Button
                            name={isEditing ? "Guardar Cambios" : "Guardar Evento"}
                            className="btn-primary"
                            icon={<FaSave />}
                            onClick={handleSubmit}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormEvento;
