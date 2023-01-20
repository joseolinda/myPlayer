function swipeleft(el, callBack) {
    if(! (el instanceof HTMLElement)) {
        console.log("swipe error", "O elemento passado não é um elemento HTML")
        return
    }

    el.addEventListener('touchstart', e => {
        el.dataset.x = Number(e.touches[0].pageX) + Number(el.dataset.move ?? 0) || 0
    })

    el.addEventListener('touchmove', e => {
        let moveX = el.dataset.x ? Number(el.dataset.x) - e.touches[0].pageX : 0
        moveX > 130 ? moveX = 130 : 0
        moveX < -130 ? moveX = -130 : 0

        el.dataset.move = moveX

        if(moveX > 0) {
            el.style.right = moveX + "px"
        }

        if(moveX > 50) {
            let newOpacity = Math.abs(el.style.opacity) - Math.abs(moveX) / 10000
            el.style.opacity = newOpacity > -1 ? newOpacity : 0
        } else {
            let newOpacity = Math.abs(el.style.opacity) + Math.abs(moveX) / 100
            el.style.opacity = newOpacity > 0 ? newOpacity : 1
        }
    })

    el.addEventListener('touchend', e => {

        let elementMove = el.dataset.move || 0;

        el.dataset.x = 0
        el.dataset.move = 0

        console.log(Number(elementMove))

        if(Number(elementMove) < 120) {
            el.style.opacity = 1
            el.style.right = 0
        } else {
            el.style.opacity = 0
            el.style.right = 300
            console.log(callBack)
            setTimeout(callBack, 380)
        }
    })

}

export default swipeleft