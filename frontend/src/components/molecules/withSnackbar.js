import React, { useState } from "react";
import Snackbar from "./snackbar";
import SnackbarPortal from "../atoms/snackbarPortal"
const withSnackbar = (Component, props) => {
    let messagesNew = [];
    let que = [];

    const HOC = props => {
        const [snacks, addSnacks] = useState([]);
        const [style, setStyle] = useState({});

        const ALPHABET =
            "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

        const ID_LENGTH = 8;

        const generate = function () {
            let rtn = "";
            for (let i = 0; i < ID_LENGTH; i++) {
                rtn += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
            }
            return rtn;
        };

        const buildStyle = position => {
            let horizontal = "flex-start"
            let vertical = "flex-start";
            let top = 0;
            let bottom = 0;


            if (position) {
                if (position.horizontal === "top") top = "10%"
                else if (position.horizontal === "center") top = "20%"
                else if (position.horizontal === "bottom") top = "83%";

                if (position.vertical === "top") vertical = "flex-start";
                else if (position.vertical === "center") vertical = "center";
                else if (position.vertical === "bottom") vertical = "flex-end";
            }

            setStyle({
                justifyContent: horizontal,
                top: top,
            });
        };

        const addCustomSnack = (Component, position) => {
            if (React.isValidElement(Component)) {
                let id = generate();
                let props = {
                    removeSnack,
                    key: id,
                    id
                };

                let Snack = React.cloneElement(Component, { ...props }, null);
                if (position) buildStyle(position);

                if (messagesNew.length === 3) {
                    que.push(Snack);
                    return addSnacks(messagesNew);
                } else {
                    messagesNew = [...messagesNew, Snack];
                    return addSnacks(messagesNew);
                }
            } else {
                return console.log(Component + " is not a valid React Element");
            }
        };

        const addSnack = (
            message = "Default Message",
            variant = "default",
            animation = "fromSide",
            dismiss = false,
            position
        ) => {
            let id = generate();

            if (position) buildStyle(position);

            let snack = (
                <Snackbar
                    id={id}
                    key={id}
                    index={id}
                    animation={animation}
                    dismiss={dismiss}
                    variant={variant}
                    removeSnack={removeSnack}
                    message={message}
                />
            );

            if (messagesNew.length === 3) {
                que.push(snack);
                addSnacks(messagesNew);
            } else {
                messagesNew = [...messagesNew, snack];
                addSnacks(messagesNew);
            }
        };

        const snackFromQue = Component => {
            messagesNew = [...messagesNew, Component];
            addSnacks(messagesNew);
        };

        const removeSnack = index => {
            let filtered = messagesNew.filter(item => item.props.id !== index);
            messagesNew = filtered;
            if (que.length > 0) {
                snackFromQue(que.shift());
                return addSnacks(filtered);
            } else {
                return addSnacks(filtered);
            }
        };

        return (
            <>
                <SnackbarPortal style={style}>
                    {messagesNew}
                </SnackbarPortal>
                <Component
                    {...props}
                    que={que.length}
                    current={messagesNew.length}
                    addCustomSnack={addCustomSnack}
                    addSnack={addSnack}
                />
            </>
        );
    };
    return HOC;
};
export default withSnackbar;