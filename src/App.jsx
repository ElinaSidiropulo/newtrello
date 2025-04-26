import { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Main from './components/Main';
import { BoardContext } from './context/BoardContext';

function App() {
    const boardData = {
        active: 0,
        boards: [
            {
                id: Date.now(), // я добавил id для совместимости с удалением
                name: 'Trello Board',
                bgcolor: '#069',
                list: [
                    { id: "1", title: "To do", items: [{ id: "cdrFt", title: "Project Description 1" }] },
                    { id: "2", title: "In Progress", items: [{ id: "cdrFv", title: "Project Description 2" }] },
                    { id: "3", title: "Done", items: [{ id: "cdrFb", title: "Project Description 3" }] }
                ]
            }
        ]
    };

    const [allboard, setAllBoard] = useState(boardData);

    const deleteBoard = (id) => {
        const newBoards = allboard.boards.filter(board => board.id !== id);
        setAllBoard(prev => ({
            ...prev,
            boards: newBoards,
            active: newBoards.length > 0 ? 0 : -1 // если досок нет — активной тоже нет
        }));
    };

    return (
        <BoardContext.Provider value={{ allboard, setAllBoard, deleteBoard }}>
            <div className='content flex'>
                <Sidebar />
                <Main />
            </div>
        </BoardContext.Provider>
    );
}

export default App;
