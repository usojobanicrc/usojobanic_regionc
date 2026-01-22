import Header from "../components/Header";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";
import { Button } from "../components/Button";
import { Footer } from "../components/Footer";
import { InputField } from "../components/InputField";
import { supabase } from "../utils/supabaseClient";
import { logActivity } from "../utils/logActivity";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Por favor completa todos los campos");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Credenciales incorrectas");
      return;
    }

    // Buscar su información en tabla usuarios
    const { data: perfil } = await supabase
      .from("usuarios")
      .select("id, nombre, apellido")
      .eq("correo", data.user.email)
      .single();

    // Buscar rol asignado
    const { data: roles } = await supabase
      .from("usuarios_roles")
      .select("roles(id, nombre)")
      .eq("usuario_id", perfil.id);

    const rol = roles?.[0]?.roles?.nombre;

    // Guardar en localStorage
    localStorage.setItem("userRol", rol);
    localStorage.setItem("userId", perfil.id);

    navigate("/dashboard");
    await logActivity(perfil.id, "Inicio de sesión", "auth", null);


    console.log("Usuario logueado:", data.user);
    console.log("Sesión activa:", data.session);
  };

  return (
    <>
      <Header />
      <div className="container_login">
        <div className="body_login">
          <div className="container_left">
            <h1 className="text-gradient">BIENVENIDA JUNTA DIRECTIVA RC</h1>
          </div>
          <div className="container_right">
            <div className="login_box">
              <h1>
                Inicia Sesión <br /> <h6>Usojobanic Región Central</h6>
              </h1>
              <InputField
                icon="bi-person-fill"
                label="Correo"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <InputField
                icon="bi-person-fill-lock"
                label="Contraseña"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="rememberme">
                <label>
                  <input type="checkbox" />
                  Recuérdame
                </label>
                <a href="#!">¿Olvidaste tu contraseña?</a>
              </div>
              <Button name="Entrar" onClick={handleLogin} />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};
