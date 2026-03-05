import React, { useEffect, useState } from "react";

const Home = () => {
    const [nuevaTarea, setNuevaTarea] = useState("");
    const [lista, setLista] = useState([]);
    const usuario = "miguelurrieta"; 


    const crearUsuario = async () => {
        try {
            await fetch(`https://playground.4geeks.com/todo/users/${usuario}`, {
                method: "POST" 
            });
            obtenerTareas(); 
        } catch (error) {
            console.error("Error al crear usuario:", error);
        }
    };

    const obtenerTareas = async () => {
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/users/${usuario}`);
            if (response.ok) {
                const data = await response.json();
                setLista(data.todos); 
            }
        } catch (error) {
            console.error("Error obteniendo tareas:", error);
        }
    };

    useEffect(() => {
    const cargarDatosIniciales = async () => {
        try {
            const resp = await fetch('https://playground.4geeks.com/todo/users/miguelurrieta');
           
            if (resp.status === 404) {
                console.log("Usuario no encontrado, creando...");
                await crearUsuario();
            } else if (resp.ok) {
                const data = await resp.json();
                setLista(data.todos || []);
                console.log("Tareas cargadas con éxito");
            }
        } catch (error) {
            console.error("Error en la conexión:", error);
        }
    };

    cargarDatosIniciales();
}, []);

const manejarAñadir = (e) => {
    if (e && e.key === "Enter" && nuevaTarea.trim() !== "") {
       
        const task = {
            label: nuevaTarea,
            is_done: false
        };

        fetch(`https://playground.4geeks.com/todo/todos/${usuario}`, {
            method: "POST",
            body: JSON.stringify(task),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(resp => {
            console.log("Respuesta ok:", resp.ok); 
            return resp.json();
        })
        .then(data => {
            console.log("Tarea guardada:", data);
            setNuevaTarea(""); 
            obtenerTareas();   
        })
        .catch(error => {
            console.error("Error al añadir:", error);
        });
    }
};


    const eliminarTarea = async (id) => {
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
                method: "DELETE"
            });
            if (response.ok) {
                obtenerTareas(); 
            }
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    };

const eliminarTodo = async () => {
    try {
        const resp = await fetch('https://playground.4geeks.com/todo/users/miguelurrieta', {
            method: "DELETE"
        });

        if (resp.ok) {
            setLista([]); 
            console.log("Lista reiniciada");

            await crearUsuario();
        }
    } catch (error) {
        console.error("Error al borrar todo:", error);
    }
};
    return (
        <div className="container mt-5">
            <h1 className="text-center">Todo List</h1>
        
            <div className="mb-2 text-secondary">
                Tareas pendientes: {lista.length}
            </div>

            <div className="input-group mb-3">
                <input
    type="text"
    className="form-control"
    value={nuevaTarea}
    onChange={(e) => setNuevaTarea(e.target.value)}
    onKeyDown={(e) => manejarAñadir(e)} 
    placeholder="¿escribe una tarea?"
/>
                <button className="btn btn-primary" onClick={manejarAñadir}>
                    Añadir
                </button>
            </div>

            <ul className="list-group shadow-sm">
                {lista.length === 0 ? (
                    <li className="list-group-item text-center text-muted">
                        No hay tareas. Agrega una
                    </li>
                ) : (
                    lista.map((tarea) => (
                        <li key={tarea.id} className="list-group-item d-flex justify-content-between align-items-center">
                            {tarea.label}
                            <button
                                className="btn btn-outline-danger btn-sm border-0 boton-oculto"
                                onClick={() => eliminarTarea(tarea.id)}
                            >
                                x
                            </button>
                        </li>
                    ))
                )};
            </ul>
            <div className="d-flex justify-content-end mt-3">
                <button
                className="btn btn-danger btn-sm"
                onClick={eliminarTodo}>Eliminar Tareas
                </button>
                </div>
        </div>
    );
};

export default Home;
