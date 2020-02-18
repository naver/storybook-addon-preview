/**
 * Copyright (c) 2020-present NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import * as React from "react";

function copyText(text, copyInput) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            alert("You have copied the code.");
        }).catch(() => {
            copyTextarea(text, copyInput);
        });
    } else {
        copyTextarea(text, copyInput);
    }
}
function copyTextarea(text: string, copyInput: HTMLTextAreaElement) {
    const range = document.createRange();

    copyInput.value = text;
    range.selectNodeContents(copyInput);

    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    copyInput.setSelectionRange(0, copyInput.value.length); // A big number, to cover anything that could be inside the element.
    copyInput.focus();
    document.execCommand('copy');
    alert("You have copied the code.");
}

export default function CopyButton({ tab, index, onCopyText }) {
    const textareaRef = React.useRef();
    const onClick = React.useCallback(() => {
        const text = onCopyText(tab, index);

        if (!text) {
            return;
        }

        copyText(text, textareaRef.current);
    }, [tab, index, onCopyText]);
    const onSelect = React.useCallback(() => {
        document.execCommand('copy');
    }, []);
    return (<button className="preview-copy" onClick={onClick}>Copy<textarea ref={textareaRef} onSelect={onSelect}></textarea></button>);
};
