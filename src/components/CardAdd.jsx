import React, { useState } from 'react';
import { X, Plus } from 'react-feather';

const CardAdd = (props) => {
    const [card, setCard] = useState('');
    const [tags, setTags] = useState('');  // добавляем состояние для tags
    const [show, setShow] = useState(false);

    const saveCard = () => {
        if (!card) return;  // если название карточки пустое, не сохраняем

        // передаем данные в родительский компонент
        props.getcard({
            title: card,
            tags: tags.split(',').map(t => t.trim()).filter(Boolean), // парсим теги
        });

        setCard('');
        setTags('');
        setShow(false);  // скрываем форму после сохранения
    };

    const closeBtn = () => {
        setCard('');  // очищаем поле для ввода
        setTags('');  // очищаем теги
        setShow(false);  // скрываем форму
    };

    return (
        <div>
            <div className="flex flex-col rounded-md text-[#D67462]">
                {show && (
                    <div>
                        <textarea
                            value={card}
                            onChange={(e) => setCard(e.target.value)}
                            className='text-[#B6A28E] p-1 w-full rounded-md border-2 bg-[#F6EABF]'
                            name=""
                            id=""
                            cols="30"
                            rows="2"
                            placeholder='Enter Card Title...'>
                        </textarea>
                        <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            className="p-1 w-full rounded-md bg-[#F6EABF]"
                            placeholder="Enter tags (comma-separated)"
                        />
                        <div className='flex p-1'>
                            <button onClick={saveCard} className='p-1 rounded bg-[#D4C17C] text-white mr-2'>Add Card</button>
                            <button onClick={closeBtn} className='p-1 rounded hover:bg-gray-600'>
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                )}
                {!show && (
                    <button onClick={() => setShow(!show)} className='flex p-1 w-full justify-start rounded items-center mt-1 hover:bg-[#D4C17C] h-8'>
                        <Plus size={16} /> Add a card
                    </button>
                )}
            </div>
        </div>
    );
};

export default CardAdd;
