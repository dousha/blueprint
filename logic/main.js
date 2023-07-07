window.addEventListener('load', () => {
    window.onkeydown = (e) => {
        wm.processKey(e.key);
    };
});
