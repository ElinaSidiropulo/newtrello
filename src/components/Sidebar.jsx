import React, { useContext, useState } from 'react';
import { ChevronRight, ChevronLeft, Plus, X } from 'react-feather';
import { Popover } from 'react-tiny-popover';
import { BoardContext } from '../context/BoardContext';
import boardPreview from '../assets/board.png';

const Sidebar = () => {
    const blankBoard = {
        name: '',
        bgcolor: '#f60000',
        list: []
    };

    const [boardData, setBoardData] = useState(blankBoard);
    const [collapsed, setCollapsed] = useState(false);
    const [showPopover, setShowPopover] = useState(false);
    const { allboard, setAllBoard, deleteBoard } = useContext(BoardContext);
    const [editingBoardId, setEditingBoardId] = useState(null);
    const [editingBoardName, setEditingBoardName] = useState('');


    const setActiveBoard = (index) => {
        setAllBoard(prev => ({
            ...prev,
            active: index
        }));
    };

    const addBoard = () => {
        const newBoard = {
            ...boardData,
            id: Date.now(),
        };

        setAllBoard(prev => ({
            ...prev,
            boards: [...prev.boards, newBoard]
        }));

        setBoardData(blankBoard);
        setShowPopover(false);
    };

    const startEditing = (board) => {
        setEditingBoardId(board.id);
        setEditingBoardName(board.name);
    };

    const handleRename = (id) => {
        if (editingBoardName.trim() === '') {
            setEditingBoardId(null);
            return;
        }
        setAllBoard(prev => ({
            ...prev,
            boards: prev.boards.map(board =>
                board.id === id ? { ...board, name: editingBoardName } : board
            )
        }));
        setEditingBoardId(null);
    };


    return (
        <div className={`bg-[#BD9867] h-[calc(100vh-3rem)] border-r border-[#9fadbc29] transition-all duration-500 flex-shrink-0 ${collapsed ? 'w-[42px]' : 'w-[280px]'}`}>
            {collapsed ? (
                <div className='p-2'>
                    <button onClick={() => setCollapsed(false)} className='hover:bg-slate-600 rounded-sm'>
                        <ChevronRight size={18} />
                    </button>
                </div>
            ) : (
                <div>
                    <div className="workspace p-3 flex justify-between border-b border-b-[#9fadbc29]">
                        <h4>Remote Devs Workspace</h4>
                        <button onClick={() => setCollapsed(true)} className='hover:bg-slate-600 rounded-sm p-1'>
                            <ChevronLeft size={18} />
                        </button>
                    </div>

                    <div className="boardlist">
                        <div className='flex justify-between px-3 py-2'>
                            <h6>Your Boards</h6>
                            <Popover
                                isOpen={showPopover}
                                align='start'
                                positions={['right', 'top', 'bottom', 'left']}
                                content={
                                    <div
                                        className='ml-2 p-2 w-60 flex flex-col justify-center items-center bg-[#CBA68E] text-[#3D3832] rounded relative'>
                                        <button onClick={() => setShowPopover(false)}
                                                className='absolute right-2 top-2 hover:bg-gray-500 p-1 rounded'>
                                            <X size={16}/>
                                        </button>
                                        <h4 className='py-3'>Create Board</h4>
                                        <img src={boardPreview} alt="Preview"/>
                                        <div className="mt-3 flex flex-col items-start w-full">
                                            <label>Board Title <span className="text-red-500">*</span></label>
                                            <input
                                                value={boardData.name}
                                                onChange={(e) => setBoardData({...boardData, name: e.target.value})}
                                                type="text"
                                                className='mb-2 h-8 px-2 w-full bg-[#DFBCA5]'
                                            />
                                            <label>Board Color</label>
                                            <input
                                                value={boardData.bgcolor}
                                                onChange={(e) => setBoardData({...boardData, bgcolor: e.target.value})}
                                                type="color"
                                                className='mb-2 h-8 px-2 w-full bg-[#DFBCA5]'
                                            />
                                            <button onClick={addBoard}
                                                    className='w-full rounded h-8 mt-2 hover:bg-[#B4917A]'>
                                                Create
                                            </button>
                                        </div>
                                    </div>
                                }
                            >
                                <button onClick={() => setShowPopover(!showPopover)} className='hover:bg-slate-600 p-1 rounded-sm'>
                                    <Plus size={16} />
                                </button>
                            </Popover>
                        </div>
                    </div>

                    <ul>
                        {allboard?.boards?.map((board, index) => (
                            <li key={board.id} className="group flex justify-between items-center px-3 hover:bg-[#9B794D]">
                                <button
                                    onClick={() => setActiveBoard(index)}
                                    className='py-2 text-sm flex-grow flex items-center text-left'
                                >
                                    <span
                                        className='w-6 h-6 rounded-sm mr-2'
                                        style={{ backgroundColor: board.bgcolor }}
                                    />
                                    {editingBoardId === board.id ? (
                                        <input
                                            value={editingBoardName}
                                            onChange={(e) => setEditingBoardName(e.target.value)}
                                            onBlur={() => handleRename(board.id)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleRename(board.id);
                                                }
                                            }}
                                            autoFocus
                                            className="bg-[#DFBCA5] rounded px-1 w-full"
                                        />
                                    ) : (
                                        <span
                                            onDoubleClick={() => startEditing(board)}
                                        >
        {board.name}
    </span>
                                    )}

                                </button>
                                <button
                                    onClick={() => deleteBoard(board.id)}
                                    className="ml-2 p-1 text-gray-400 hover:text-red-500 hidden group-hover:inline"
                                    title="Delete board"
                                >
                                    <X size={14} />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
