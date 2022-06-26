import React from "react";
function PopupWithForm ({name, title, children,isOpen, onClose, buttonText, onSubmit}) {
    const closeClickOverlay = (e) => {
        if (e.target.classList.contains('popup')) {
          onClose()
        }
      }
      React.useEffect(() => {
          const closeClickEsc = (e) => {
          if (e.key === "Escape") {
            onClose()
          }
        }
        document.addEventListener('keyup', closeClickEsc);
        return () => {
          document.removeEventListener('keyup', closeClickEsc);
        }
      }, []);
    return (
        <div onClick={closeClickOverlay} className={`popup popup_type_${name} ${isOpen && "popup_opened"}`} > 
            <div className="popup__container">
                <button type="button" className="popup__close" onClick={onClose}></button>
                <h2 className='popup__text'>{title}</h2>
                <form action="submit" className='popup__form' name={name} onSubmit={onSubmit}>
                    {children}
                    <button type="submit" className="popup__save">{buttonText}</button>
                </form>
            </div>
        </div>
    )
}

export default PopupWithForm