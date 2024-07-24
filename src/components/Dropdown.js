import React, { useEffect, useState } from 'react';
import styles from '../css/dropdown.module.css';

function CustomDropdown({ title, options, onSelect, onSubmit }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(title);

    const toggleDropdown = () => {
        setDropdownOpen(prevState => !prevState);
    };

    const emptyBox = () => {
        setSelectedItem(title);
    }

    useEffect(() => {
        function checkSubmitted() {
            if(onSubmit){
                setSelectedItem(title);
            }
        }
        checkSubmitted();
    }, [onSubmit, title]);

    const handleSelect = (option) => {
        let value;
        if (typeof option === 'object') {
            setSelectedItem(option.label);
            value = `${option.value}-${option.value.toUpperCase()}`;
        } else {
            setSelectedItem(option);
            value = option.toUpperCase();
        }
        onSelect(value);
        setDropdownOpen(false);
    };

    return (
        <div className={styles.dropdown}>
            <div className='row'>
                <button className={styles.dropbutton} type="button" onClick={toggleDropdown}>
                    {selectedItem}
                </button>
                {selectedItem !== title && (
                <button id='cancel' type='button' className={styles.cancelButton} onClick={emptyBox}>
                   <span  style={{ color:'white'}}>x</span>
                </button>)
                }
            </div>
            <ul className={styles.dropdownmenu} style={{ display: dropdownOpen ? 'block' : 'none' }}>
                {options.map((option, index) => (
                    <button key={index} className={styles.dropdownitem} onClick={() => handleSelect(option)}>
                        {typeof option === 'object' ? option.label : option}
                    </button>
                ))}
            </ul>
        </div>
    );
}

export default CustomDropdown;
