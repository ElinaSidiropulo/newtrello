import { createContext, useState, useEffect } from "react";

export const BoardContext = createContext({});

export const BoardProvider = ({ children }) => {
    // Загрузка из localStorage при старте
    const [allboard, setAllBoard] = useState(() => {
        try {
            const saved = localStorage.getItem("trello-boards");
            const parsed = saved ? JSON.parse(saved) : { boards: [] };
            console.log("Загружены доски из localStorage:", parsed);  // Логируем данные при загрузке
            return parsed;
        } catch (e) {
            console.error("Ошибка при загрузке данных из localStorage:", e);
            return { boards: [] };  // Если ошибка, возвращаем пустой объект с пустым массивом
        }
    });

    // Сохранение в localStorage при изменениях
    useEffect(() => {
        if (allboard.boards.length === 0) {
            console.log("Нет данных для сохранения в localStorage");
            return;  // Если массив пустой, не сохраняем
        }

        console.log("boards перед сохранением в localStorage:", allboard.boards);
        try {
            localStorage.setItem("trello-boards", JSON.stringify(allboard));
            console.log("Данные сохранены в localStorage");
        } catch (e) {
            console.error("Ошибка при сохранении данных в localStorage:", e);
        }
    }, [allboard]);

    // Функция создания доски
    const createBoard = (name) => {
        const newBoard = {
            id: Date.now(),
            name,
            tag: "",
            columns: [],
        };
        setAllBoard((prevState) => ({
            ...prevState, // сохраняем остальные данные
            boards: [...prevState.boards, newBoard],
        }));
    };

    // Редактировать имя доски
    const editBoard = (id, newName) => {
        console.log(`Редактирую доску с id ${id}, новое имя: ${newName}`);
        setAllBoard((prevState) => ({
            ...prevState,
            boards: prevState.boards.map((board) =>
                board.id === id ? { ...board, name: newName } : board
            ),
        }));
    };

    const editBoardTag = (id, newTag) => {
        console.log(`Редактирую тег доски с id ${id}, новый тег: ${newTag}`);
        setAllBoard((prevState) => ({
            ...prevState,
            boards: prevState.boards.map((board) =>
                board.id === id ? { ...board, tag: newTag } : board
            ),
        }));
    };

    // Удалить доску
    const deleteBoard = (id) => {
        console.log(`Deleting board with id: ${id}`);
        setAllBoard((prev) => {
            const updatedBoards = prev.boards.filter((board) => board.id !== id);
            console.log('Updated Boards:', updatedBoards);
            return { boards: updatedBoards };
        });
    };



    // Добавить колонку
    const addColumn = (boardId, columnName) => {
        console.log(`Добавляю колонку '${columnName}' на доску с id ${boardId}`);
        setAllBoard((prevState) => ({
            ...prevState,
            boards: prevState.boards.map((board) =>
                board.id === boardId
                    ? {
                        ...board,
                        columns: [
                            ...board.columns,
                            { id: Date.now(), name: columnName, tasks: [] },
                        ],
                    }
                    : board
            ),
        }));
    };

    // Добавить задачу (карточку)
    const addTask = (boardId, columnId, taskTitle) => {
        console.log(`Добавляю задачу '${taskTitle}' в колонку ${columnId} на доске ${boardId}`);
        setAllBoard((prevState) => ({
            ...prevState,
            boards: prevState.boards.map((board) =>
                board.id === boardId
                    ? {
                        ...board,
                        columns: board.columns.map((col) =>
                            col.id === columnId
                                ? {
                                    ...col,
                                    tasks: [
                                        ...col.tasks,
                                        {
                                            id: Date.now(),
                                            title: taskTitle,
                                            completed: false,
                                            tags: [],
                                        },
                                    ],
                                }
                                : col
                        ),
                    }
                    : board
            ),
        }));
    };

    return (
        <BoardContext.Provider
            value={{
                allboard,
                setAllBoard,
                createBoard,
                editBoard,
                deleteBoard,
                addColumn,
                addTask,
            }}
        >
            {children}
        </BoardContext.Provider>
    );
};
