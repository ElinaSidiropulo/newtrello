import React, { useContext, useState, useEffect } from 'react';
import { MoreHorizontal, UserPlus, Edit2 } from 'react-feather';
import CardAdd from './CardAdd';
import { BoardContext } from '../context/BoardContext';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import AddList from './AddList';
import Utils from '../utils/Utils';


const Main = () => {
    const { allboard, setAllBoard } = useContext(BoardContext);
    const bdata = allboard.boards[allboard.active];
    const [editIndex, setEditIndex] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editTags, setEditTags] = useState('');
    const [editingListTitleIndex, setEditingListTitleIndex] = useState(null);
    const [newListTitle, setNewListTitle] = useState('');


    // Загрузка данных из localStorage при монтировании компонента
    useEffect(() => {
        const savedBoardData = localStorage.getItem('boardData');
        if (savedBoardData) {
            setAllBoard(JSON.parse(savedBoardData)); // Если данные есть, загружаем их
        }
    }, []);

    // Сохранение данных в localStorage при изменении состояния allboard
    useEffect(() => {
        if (allboard) {
            localStorage.setItem('boardData', JSON.stringify(allboard)); // Сохраняем данные
        }
    }, [allboard]);

    function onDragEnd(res) {
        if (!res.destination) return;

        const newList = [...bdata.list];
        const s_id = parseInt(res.source.droppableId);
        const d_id = parseInt(res.destination.droppableId);
        const [removed] = newList[s_id].items.splice(res.source.index, 1);
        newList[d_id].items.splice(res.destination.index, 0, removed);

        const board_ = { ...allboard };
        board_.boards[board_.active].list = newList;
        setAllBoard(board_);
    }

    const cardData = (e, ind) => {
        const newBoards = allboard.boards.map((board, boardIndex) => {
            if (boardIndex !== allboard.active) return board;
            const newList = board.list.map((list, listIndex) => {
                if (listIndex !== ind) return list;
                return {
                    ...list,
                    items: [
                        ...list.items,
                        {
                            id: Utils.makeid(5),
                            title: e.title,
                            tags: Array.isArray(e.tags) ? e.tags : [],
                        },
                    ],
                };
            });
            return { ...board, list: newList };
        });

        setAllBoard({ ...allboard, boards: newBoards });
    };


    const listData = (e) => {
        const newBoards = allboard.boards.map((board, boardIndex) => {
            if (boardIndex !== allboard.active) return board;

            const newList = [...board.list, {
                id: `${board.list.length}`,
                title: e,
                items: []
            }];

            return { ...board, list: newList };
        });

        setAllBoard({ ...allboard, boards: newBoards });
    };


    const deleteCard = (listIndex, cardIndex) => {
        const newBoards = allboard.boards.map((board, boardIndex) => {
            if (boardIndex !== allboard.active) return board;

            const newList = board.list.map((list, idx) => {
                if (idx !== listIndex) return list;

                const newItems = list.items.filter((_, i) => i !== cardIndex);
                return { ...list, items: newItems };
            });

            return { ...board, list: newList };
        });

        setAllBoard({ ...allboard, boards: newBoards });
    };


    const saveEdit = (listIndex, cardIndex) => {
        const newBoards = allboard.boards.map((board, boardIndex) => {
            if (boardIndex !== allboard.active) return board;

            const newList = board.list.map((list, idx) => {
                if (idx !== listIndex) return list;

                const newItems = list.items.map((item, i) => {
                    if (i !== cardIndex) return item;
                    return {
                        ...item,
                        title: editTitle,
                        tags: editTags
                            .split(',')
                            .map(tag => tag.trim())
                            .filter(tag => tag.length > 0),
                    };
                });

                return { ...list, items: newItems };
            });

            return { ...board, list: newList };
        });

        setAllBoard({ ...allboard, boards: newBoards });
        setEditIndex(null);
        setEditTitle('');
        setEditTags('');
    };

    const saveListTitle = (listIndex) => {
        const newBoards = allboard.boards.map((board, boardIndex) => {
            if (boardIndex !== allboard.active) return board;

            const newList = board.list.map((list, idx) => {
                if (idx !== listIndex) return list;
                return { ...list, title: newListTitle };
            });

            return { ...board, list: newList };
        });

        setAllBoard({ ...allboard, boards: newBoards });
        setEditingListTitleIndex(null);
        setNewListTitle('');
    };

    const deleteList = (listIndex) => {
        const newBoards = allboard.boards.map((board, boardIndex) => {
            if (boardIndex !== allboard.active) return board;

            const newList = board.list.filter((_, idx) => idx !== listIndex);
            return { ...board, list: newList };
        });

        setAllBoard({ ...allboard, boards: newBoards });
    };



    return (
        <div className="flex flex-col w-full" style={{ backgroundColor: "#A4754A" }}>
            <div className="p-3 bg-[#DFBE8D] flex justify-between w-full font-bold">
                <h2 className="text-lg">{bdata.name}</h2>
                <div className="flex items-center justify-center">
                </div>
            </div>
            <div className="flex flex-col w-full flex-grow relative">
                <div className="absolute mb-1 pb-2 left-0 right-0 top-0 bottom-0 p-3 flex overflow-x-scroll overflow-y-hidden">
                    <DragDropContext onDragEnd={onDragEnd}>
                        {bdata.list &&
                            bdata.list.map((x, ind) => (
                                <div key={x.id} className="mr-3 w-60 h-fit rounded-md p-2 bg-brown-100 flex-shrink-0">
                                    <div className="list-body">
                                        <div className="flex justify-between p-1">
                                            {editingListTitleIndex === ind ? (
                                                <input
                                                    type="text"
                                                    value={newListTitle}
                                                    onChange={(e) => setNewListTitle(e.target.value)}
                                                    onBlur={() => saveListTitle(ind)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            saveListTitle(ind);
                                                        }
                                                    }}
                                                    autoFocus
                                                    className="bg-brown-300 text-white border border-zinc-600 p-1 rounded w-full"
                                                />
                                            ) : (
                                                <span
                                                    className="cursor-pointer"
                                                    onClick={() => {
                                                        setEditingListTitleIndex(ind);
                                                        setNewListTitle(x.title);
                                                    }}
                                                >
            {x.title}
        </span>
                                            )}
                                            <div className="flex gap-1">
                                                <button
                                                    className="hover:bg-gray-500 p-1 rounded-sm"
                                                    onClick={() => deleteList(ind)}
                                                    title="Delete list"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>

                                        <Droppable droppableId={`${ind}`}>
                                            {(provided) => (
                                                <div ref={provided.innerRef} {...provided.droppableProps}>
                                                    {x.items.map((item, index) => (
                                                        <Draggable key={item.id} draggableId={item.id} index={index}>
                                                            {(provided) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    className="mb-2"
                                                                >
                                                                    {editIndex?.list === ind && editIndex?.card === index ? (
                                                                        <div className="flex flex-col bg-[#D4C17C] p-1 rounded-md">
                                                                            <input
                                                                                type="text"
                                                                                className="p-1 mb-1 rounded bg-[#F6EABF] text-[#3D3832]"
                                                                                value={editTitle}
                                                                                onChange={(e) => setEditTitle(e.target.value)}
                                                                                placeholder="Title"
                                                                            />
                                                                            <input
                                                                                type="text"
                                                                                className="p-1 mb-2 rounded bg-[#F6EABF] text-[#3D3832]"
                                                                                value={editTags}
                                                                                onChange={(e) => setEditTags(e.target.value)}
                                                                                placeholder="Tags (comma separated)"
                                                                            />

                                                                            <div className="flex gap-1">
                                                                                <button
                                                                                    onClick={() => saveEdit(ind, index)}
                                                                                    className="bg-[#ABB265] text-white px-2 py-1 rounded"
                                                                                >
                                                                                    Save
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => setEditIndex(null)}
                                                                                    className="bg-[#BD7960] text-white px-2 py-1 rounded"
                                                                                >
                                                                                    Cancel
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="item flex justify-between items-center p-1 cursor-pointer rounded-md bg-rose-300 bg-opacity-50 border-2 border-[#F4BCA0] hover:border-rose-300">
                                                                            <span>{item.title}</span>
                                                                            {Array.isArray(item.tags) && item.tags.length > 0 && (
                                                                                <div className="flex gap-2 ml-auto">
                                                                                    {item.tags.map((tag, idx) => (
                                                                                        <span key={idx} className="text-xs text-[#B4806D] p-1">
                                    {tag}
                                </span>
                                                                                    ))}
                                                                                </div>
                                                                            )}
                                                                            <div className="flex gap-1">
                                                                                <button
                                                                                    onClick={() => {
                                                                                        setEditIndex({ list: ind, card: index });
                                                                                        setEditTitle(item.title);
                                                                                        setEditTags(item.tags.join(', '));
                                                                                    }}
                                                                                    className="hover:bg-gray-600 p-1 rounded-sm"
                                                                                >
                                                                                    <Edit2 size={16} />
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => deleteCard(ind, index)}
                                                                                    className="hover:bg-red-100 p-1 rounded-sm text-red-400"
                                                                                >
                                                                                    ✕
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </Draggable>

                                                    ))}
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                        <CardAdd getcard={(e) => cardData(e, ind)} />
                                    </div>
                                </div>
                            ))}
                        <AddList getlist={(e) => listData(e)} />
                    </DragDropContext>
                </div>
            </div>
        </div>
    );
};

export default Main;
