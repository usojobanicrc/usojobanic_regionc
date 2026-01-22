import Fondo from '../components/Fondo';
import Header from '../components/Header'
import "../css/Principios.css"
import { Footer } from "../components/Footer";

const Principios = () => {



    return (
        <>
            <Header />
            <Fondo />

            <div className='containerprincipios'>

                <div className='containertitulo'>
                    <div className='titulo'>
                        <h2>PRINCIPIOS BAUTISTAS</h2>
                        <img src="/principios logo.png" alt="" />
                    </div>
                    <p>Los principios bautistas fueron surgiendo de manera gradual a partir del siglo XVI, en Europa en  estados que estaban en procesos económicos y políticos cambiantes.
                        Son normas eclesiales que rigen y orientan la actividad de la iglesia, congregación o sociedad que  pertenece a la CBN.</p>
                </div>

                <div className='containertarjetasprincipios'>

                    <h1 className='tarjetaprincipios-titulo'>PRINCIPIO Nº 1: El señorio de Jesucristo</h1>

                    <p className='contenidoprincipios-parrafo'>La iglesia reconoce la autoridad de Jesucristo a partir de sus enseñanzas y de la causa del reino de  Dios que él ha predicado. Por eso la iglesia debe obedecer los mandamientos de Jesús de  Nazaret que ha dejado en los evangelios y a través de sus apóstoles.<br /><br />

                        Bases bíblicas:  Juan 3,13; Hechos 2,36; Filipenses 2,1-11; Col 2, 8-15; Apocalipsis 17,14,19,16.
                    </p>


                </div>

                <div className='containertarjetasprincipios'>

                    <h1 className='tarjetaprincipios-titulo'>PRINCIPIO Nº 2: La Biblia es la única y suprema regla de fe y práctica </h1>

                    <p className='contenidoprincipios-parrafo'>La Biblia es nuestra única autoridad en asuntos de fe y conducta. Inspirada por Dios, nos enseña cómo vivir, orar y seguir a Cristo en todos los aspectos de la vida.<br /><br />

                        Bases bíblicas: Jn 5,39; 2 Tim 3,15-17. Pe. 1:19-21
                    </p>


                </div>

                <div className='containertarjetasprincipios'>

                    <h1 className='tarjetaprincipios-titulo'>PRINCIPIO Nº 3:  La Iglesia está compuesta de creyentes convertidos y bautizados por  inmersión en nombre del Padre, del Hijo y del Espíritu Santo.</h1>

                    <p className='contenidoprincipios-parrafo'>La iglesia está compuesta por personas que han creído en Cristo, han experimentado una transformación espiritual y han sido bautizadas por inmersión en el nombre del Padre, del Hijo y del Espíritu Santo.<br /><br />

                        Base Bíblica: Mt 28 18-20
                    </p>


                </div>

                <div className='containertarjetasprincipios'>

                    <h1 className='tarjetaprincipios-titulo'>PRINCIPIO Nº 4:  El sacerdocio de todos los creyentes.</h1>

                    <p className='contenidoprincipios-parrafo'>Todos los creyentes tienen acceso directo a Dios y son llamados a servirle, sin distinción de jerarquías. Cada uno tiene la responsabilidad de vivir y compartir su fe, ejerciendo un sacerdocio espiritual.<br /><br />


                        Base Bíblica: 1 Pedro 2,9; Apocalipsis 5,10; 1 Timoteo 2,5
                    </p>


                </div>
                <div className='containertarjetasprincipios'>

                    <h1 className='tarjetaprincipios-titulo'>PRINCIPIO Nº5: La autonomía de la iglesia local.</h1>

                    <p className='contenidoprincipios-parrafo'>Cada iglesia bautista es autónoma y toma sus propias decisiones bajo principios congregacionales, pero mantiene unidad con otras iglesias. Las decisiones administrativas las toma la congregación, no solo el pastor o los diáconos. El culto es guiado por el pastor con apoyo de líderes, asegurando orden y respeto a la doctrina y normativas legales.<br /><br />

                        Base Bíblica: Rom 14:17-18; Luc 9,23; Rom 14;  1 Tim 2 1-6
                    </p>


                </div>
                <div className='containertarjetasprincipios'>

                    <h1 className='tarjetaprincipios-titulo'>PRINCIPIO Nº 6: Libertad de Conciencia</h1>

                    <p className='contenidoprincipios-parrafo'>Cada creyente es responsable ante Dios por sus actos. La conciencia moral es un juez interior que guía nuestras decisiones según el bien y el mal. La libertad de conciencia permite elegir ideologías y creencias basadas en la Biblia, sin imponerlas a la iglesia. Los pastores no deben hacer proselitismo político desde el púlpito, pero sí orar por las autoridades para vivir en paz, como enseña 1 Timoteo 2:1-6.<br /><br />

                        Base Bíblica: Mt 22,21; Jn 6,15; 18,36
                    </p>


                </div>
                <div className='containertarjetasprincipios'>

                    <h1 className='tarjetaprincipios-titulo'>PRINCIPIO Nº 7: Separación de la Iglesia y el Estado</h1>

                    <p className='contenidoprincipios-parrafo'>El Estado es una organización política con poderes Ejecutivo, Legislativo y Judicial. Históricamente, los gobernantes controlaban la iglesia, pero el ideal bautista es que cada iglesia sea autónoma, se sostenga por sí misma y respete las leyes.
                        Las iglesias colaboran con el Estado en temas de bienestar común, pero deben evitar la confusión entre ambos. Los pastores deben promover la paz y respetar la diversidad política de sus miembros.
                        Las iglesias bautistas apoyan el Estado laico, promoviendo la libertad religiosa y evitando que el Estado tenga una religión oficial.<br /><br />

                        Base Bíblica: Mt 22,21; Jn 6,15; 18,36
                    </p>


                </div>

                <div className='containertarjetasprincipios'>

                    <h1 className='tarjetaprincipios-titulo'>PRINCIPIO Nº8: El libre examen de las escrituras (el libre examen de La Biblia)</h1>

                    <p className='contenidoprincipios-parrafo'>La interpretación de la Biblia es responsabilidad de toda la comunidad, no de un grupo exclusivo. Requiere estudio, normas hermenéuticas y la guía del Espíritu Santo. Se debe considerar el contexto histórico y literario, utilizando diversas traducciones y estudios teológicos para evitar errores doctrinales.<br /><br />

                        Base Bíblica: Jn 5,39; Hch 17,11
                    </p>


                </div>


            </div>
            <Footer />

        </>
    )
}

export default Principios;