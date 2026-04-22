import React, { createContext, useContext, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export const ErrorModalContext = createContext({ show: false, message: '', content: '' });

export const ErrorModalProvider = ({ children }) => {
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState('');
    const [content, setContent] = useState('');

    const showError = (message, content) => {
        setMessage(message);
        setContent(content);
        setShow(true);
    }

    const hideError = () => setShow(false);

    return <ErrorModalContext.Provider value={{ show, message, content, showError, hideError }}>{children}</ErrorModalContext.Provider>
}

export function ErrorModal(args) {
    const { show, message, content, hideError } = useContext(ErrorModalContext);

    return (
        <div>
            <Modal isOpen={show} toggle={hideError} {...args}>
                <ModalHeader toggle={hideError}>{message}</ModalHeader>
                <ModalBody>{content}</ModalBody>
            </Modal>
        </div>
    );
}
