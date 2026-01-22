import React, { useState, useEffect } from "react";
import '../css/GenericForm.css'

function GenericForm({
    fields = [],
    initialData = {},
    onSubmit,
    onClose,
    createRecord,
    updateRecord,
    isEditing
}) {

    // ----------- SANEAR EL ESTADO INICIAL -----------
    const getInitialState = (initial) => {
        const data = initial || {};

        const safeValue = (key, fallback = "") => {
            const val = data[key];
            if (val === null || val === undefined || val === "") return fallback;
            return String(val);
        };

        const state = {};

        fields.forEach((f) => {
            // Checkbox / boolean
            if (f.type === "boolean" || f.type === "checkbox") {
                state[f.key] = data[f.key] ?? false;
                return;
            }

            // Date → convertir "2024-05-10T00:00:00" → "2024-05-10"
            if (f.type === "date") {
                const raw = safeValue(f.key, "");
                const trimmed = raw.includes("T") ? raw.split("T")[0] : raw;
                state[f.key] = trimmed;
                return;
            }

            // Default (text, email, url, number, select, etc.)
            state[f.key] = safeValue(f.key, "");
        });

        return state;
    };

    // ----------- Estado del formulario -----------
    const [formData, setFormData] = useState(() => getInitialState(initialData));

    // Cuando pasas a editar un registro, recarga valores
    useEffect(() => {
        setFormData(getInitialState(initialData));
    }, [initialData]);

    // ----------- Manejo de inputs -----------
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    // ----------- Envío del formulario -----------
    const handleSubmit = async (e) => {
        e.preventDefault();

        let payload = { ...formData };

        // Convertir selects de string a number
        fields.forEach((f) => {
            if (f.type === "select") {
                if (payload[f.key] !== "") {
                    payload[f.key] = Number(payload[f.key]);
                } else {
                    delete payload[f.key];
                }
            }
        });

        if (isEditing) {
            const { id, ...clean } = payload;
            const result = await updateRecord(initialData.id, clean, {});
            if (result.success) onSubmit();
        } else {
            const result = await createRecord(payload, {});
            if (result.success) onSubmit();
        }
    };

    // ----------- Render dinámico de campos -----------
    const renderField = (field) => {
        const { key, label, type, options } = field;
        const value = formData[key];

        switch (type) {
            case "boolean":
            case "checkbox":
                return (
                    <div className="form-group checkbox-group" key={key}>
                        <label className="form-label">{label}</label>
                        <input
                            type="checkbox"
                            name={key}
                            checked={!!value}
                            onChange={handleChange}
                            className="form-checkbox"
                        />
                    </div>
                );

            case "select":
                return (
                    <div className="form-group" key={key}>
                        <label className="form-label">{label}</label>
                        <select
                            name={key}
                            value={value}
                            onChange={handleChange}
                            className="form-input"
                        >
                            <option value="">Seleccione una opción</option>
                            {options?.map((opt) => (
                                <option key={opt.value} value={String(opt.value)}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                );

            case "date":
                return (
                    <div className="form-group" key={key}>
                        <label className="form-label">{label}</label>
                        <input
                            type="date"
                            name={key}
                            value={value || ""}
                            onChange={handleChange}
                            className="form-input"
                        />
                    </div>
                );

            default:
                return (
                    <div className="form-group" key={key}>
                        <label className="form-label">{label}</label>
                        <input
                            type={type}
                            name={key}
                            value={value}
                            onChange={handleChange}
                            className="form-input"
                        />
                    </div>
                );
        }
    };

    // ----------- Render principal -----------
    return (
        <form onSubmit={handleSubmit} className="generic-form">
            {fields
                .filter((f) => f.key !== "id" && !f.hideInForm)
                .map((field) => renderField(field))}

            <div className="form-actions">
                <button type="submit" className="btn-base btn-primary">
                    {isEditing ? "Guardar Cambios" : "Crear Registro"}
                </button>
            </div>
        </form>
    );
}

export default GenericForm;
