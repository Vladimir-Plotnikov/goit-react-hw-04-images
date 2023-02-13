import { useEffect } from "react";
import { Overlay } from "./Modal.styled";
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'

const modalRoot = document.querySelector('#modal-root')

export function Modal({image, onClose}){
    useEffect(() => {
        const handleKeydown = e => {
            if (e.code === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeydown)
        
        return () => {
            window.removeEventListener('keydown', handleKeydown)
        }
    }, [onClose]);


const handleBackdropClick = e => {
        if (e.currentTarget === e.target) {
            onClose(); 
        }
    };

    return createPortal(
        <Overlay onClick={handleBackdropClick}>
            <div>
                <img src={image} alt=""/>
            </div>
        </Overlay>,
        modalRoot
);
    }

Modal.propTypes = {
    image: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
  };



