import React, { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

export const AppContext = createContext({});

export default function AppContextProvider({ children }) {
  const [modal, setModal] = useState(null);
  const [notif, setNotif] = useState('');
  const [onCloseModal, setOnCloseModal] = useState(() => () => {});
  const [overlay, setOverlay] = useState(false);

  const value = {
    setModal,
    notif, setNotif,
    setOnCloseModal,
    setOverlay,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
      <Modal modal={modal} onClose={onCloseModal} setModal={setModal} />
      {overlay && <div className="overlay" />}
      <Notif notif={notif} setNotif={setNotif} />
    </AppContext.Provider>
  );
}

AppContextProvider.defaultProps = {
  children: null,
};

AppContextProvider.propTypes = {
  children: PropTypes.node,
};

export function Modal({ modal, onClose, setModal }) {
  const { pathname } = useLocation();

  const closeModal = e => {
    (e.target === e.currentTarget) && onClose();
  };

  useEffect(() => {
    const body = document.getElementsByTagName('body')[0];
    modal ? body.classList.add('modal-open') : body.classList.remove('modal-open');
  }, [!!modal]);

  useEffect(() => {
    document.getElementsByTagName('html')[0].scrollTo(0, 0);
    setModal(null);
  }, [pathname]);

  return <div className="modal" onClick={closeModal}>{modal}</div>;
}

Modal.defaultProps = {
  modal: null,
};

Modal.propTypes = {
  modal: PropTypes.node,
  onClose: PropTypes.func.isRequired,
  setModal: PropTypes.func.isRequired,
};

export function Notif({ notif, setNotif }) {
  const { state = '' } = useLocation();
  const [prevNotif, setPrevNotif] = useState('');

  useEffect(() => {
    const elNotif = document.getElementsByClassName('notif')[0];
    if (notif && !prevNotif) {
      elNotif.classList.add('active');
      setPrevNotif(notif);
      setTimeout(() => {
        setNotif('');
      }, 7500);
      setTimeout(() => {
        elNotif.classList.remove('active');
      }, 7000);
    } else if (!notif && prevNotif) {
      setPrevNotif('');
    }
  }, [notif]);

  useEffect(() => {
    state.notif && setNotif(state.notif);
  }, [state.notif]);

  return (
    <div className="notif"
      style={{ backgroundColor: `${notif.split('---').length > 1 ? notif.split('---')[1] : '#0eb37e'}` }}
    >{notif.split('---')[0]}</div>
  );
}

Notif.propTypes = {
  notif: PropTypes.string.isRequired,
  setNotif: PropTypes.func.isRequired,
};
