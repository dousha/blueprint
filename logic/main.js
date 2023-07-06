window.addEventListener('load', () => {
    window.onkeydown = (e) => {
        console.log(e);
        wm.processKey(e.key);
    };
});
