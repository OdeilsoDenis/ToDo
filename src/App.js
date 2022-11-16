import './App.css';
import {useState, useEffect} from 'react'; // Importando Hooks
import {BsTrash, BsBookmarkCheck, BsBookmarkCheckFill} from "react-icons/bs"; // Importando Icones

const API = "http://localhost:5000"; // Ip que vai acessar a API

function App() {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [todos, setTodos] = useState([]); // Lista de tarefas
  const [loading, setLoading] = useState(false); // Feedback de carregamento 

  // Load todos on page load
  useEffect(() => {
    const loadData = async() => {
      setLoading(true);

      const res = await fetch(API + "/todos")
        .then((res) => res.json())
        .then((data) => data)
        .catch((err) => console.log(err));
      
        setLoading(false)
        setTodos(res);
    };
    loadData();
  }, [])

  // Envio para API
  const handleSubmit = async (e) => { // Função de obter e enviar os dados do formulario para o servidor
    e.preventDefault(); // Para o evento do formulario e mantem o fluxo SPA
    const todo = { // Criando um objeto
      id: Math.random(),
      title,
      time,
      done: false,
    };

    await fetch(API + "/todos", {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setTodos((prevState) => [...prevState, todo]); // Estado anterior do item

    // Zerando as Variaveis
    setTitle("");
    setTime("");
  };

  const handleDelete = async (id) => {
    await fetch(API + "/todos/" + id, {
      method: "DELETE"
    });

    setTodos((prevState) => prevState.filter((todo) => todo.id !== id));
  }

  const handleEdit = async (todo) => {
    todo.done = !todo.done;

    const data = await fetch(API + "/todos/" + todo.id, {
      method: "PUT",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      }
    });
    setTodos((prevState) => prevState.map((t) => (t.id === data.id ? (t = data) : t)));
  };

  if(loading) {
    return <p>Carregando...</p>
  }

  return (
    <div className="App">
      <div className="todo-header"> 
        <h1>React Todo</h1> {/* Titulo do projeto */}
      </div>
      <div className="form-todo">
        <h2>Insira a sua próxima tarefa:</h2>{/* Formulario */}
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="title">O que você vai fazer?</label>
            <input 
              type="text"
              name="title"
              placeholder="Título da tarefa"
              onChange={(e) => setTitle(e.target.value)}
              value={title || ""}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="time">Duração:</label>
            <input 
              type="text"
              name="time"
              placeholder="Tempo estimado (em horas)"
              onChange={(e) => setTime(e.target.value)}
              value={time || ""}
              required
            />
          </div>
          <input type="submit" value="Criar Tarefa"/>
        </form>
      </div>
      <div className="list-todo">
        <h2>Lista de Tarefas</h2>{/* Lista de tarefas */}
        {todos.length === 0 && <p>Não há tarefas!</p>}
        {todos.map((todo) => (
          <div className="todo" key={todo.id}>
            <h3 className={todo.done ? "todo-done" : ""}>{todo.title}</h3>
            <p>Duração: {todo.time}</p>
            <div className="actions">
              <span onClick={() => handleEdit(todo)}>
                {!todo.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill /> } 
              </span>
              <BsTrash onClick={() => handleDelete(todo.id)}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
