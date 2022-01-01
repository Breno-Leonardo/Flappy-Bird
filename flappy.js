function criaElemento(tagName, className) {
    const elemento = document.createElement(tagName);
    elemento.className = className;
    return elemento;
}

function Cano(reversa = false) {
    this.elemento = criaElemento("div", "cano")

    let corpo = criaElemento("div", "cano-corpo")
    let boca = criaElemento("div", "cano-boca")
    if (!reversa) {
        this.elemento.appendChild(boca)
        this.elemento.appendChild(corpo)
    } else {
        this.elemento.appendChild(corpo)
        this.elemento.appendChild(boca)
    }
    this.setAltura = altura => {
        corpo.style.height = `${altura}px`
    }

}

function doisCanos(altura, abertura, x) {
    this.elemento = criaElemento("div", "dois-canos")
    this.canoCima = new Cano(true)
    this.canoBaixo = new Cano(false)
    this.elemento.appendChild(this.canoCima.elemento)
    this.elemento.appendChild(this.canoBaixo.elemento)
    this.abertura = () => {
        const alturaSuperior = Math.random() * (altura - abertura)
        const alturaInferior = altura - alturaSuperior - abertura
        this.canoCima.setAltura(alturaSuperior)
        this.canoBaixo.setAltura(alturaInferior)
    }
    this.getX = () => parseInt(this.elemento.style.left.split("px")[0])
    this.setX = x => this.elemento.style.left = `${x}px`
    this.getLargura = () => this.elemento.clientWidth
    this.abertura()
    this.setX(x)
}

// const canos1= new doisCanos(700,400, 400)
// document.querySelector("#tela-jogo").appendChild(canos1.elemento)

function variosCanos(altura, largura, abertura, espaco, notificar) {
    this.canos = [
        new doisCanos(altura, abertura, largura),
        new doisCanos(altura, abertura, largura + espaco),
        new doisCanos(altura, abertura, largura + espaco * 2),
        new doisCanos(altura, abertura, largura + espaco * 3)
    ]

    const deslocamento = 3
    this.animar = () => {
        this.canos.forEach(cano => {
            cano.setX(cano.getX() - deslocamento)
            if (cano.getX() < -cano.getLargura()) { // saiu completamente da tela
                cano.setX(cano.getX() + espaco * this.canos.length)
                cano.abertura()

            }

            const meio = largura / 2
            const passouMeio = cano.getX() + deslocamento >= meio && cano.getX() < meio
            if (passouMeio)
                notificar()
        })

    }

}

function Passaro(altura) {
    let voando = false
    this.elemento = criaElemento("img", "passaro");
    this.elemento.src = "passaro.png"
    this.getY = () => parseInt(this.elemento.style.bottom.split("px")[0])
    this.setY = y => this.elemento.style.bottom = `${y}px`
    window.onkeydown = e => voando = true
    window.onkeyup = e => voando = false
    this.animar = () => {
        const novoY = this.getY() + (voando ? 8 : -5)
        maxAltura = altura - this.elemento.clientHeight
        if (novoY <= 0)
            this.setY(0)
        else if (novoY >= maxAltura)
            this.setY(maxAltura)
        else
            this.setY(novoY)
    }
    this.setY(altura / 2)
}

function Progresso() {
    this.elemento = criaElemento("span", "progresso")
    this.atualizarPontos = pontos => {
        this.elemento.innerHTML = pontos
    }
    this.atualizarPontos(0)
}



function sobrepostos(A, B) {
    const a = A.getBoundingClientRect()
    const b = B.getBoundingClientRect()
    // const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left
     const horizontal= a.right >= b.left  && b.right >= a.left
    // const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top
    const vertical = a.bottom >= b.top && b.bottom >= a.top
    return vertical && horizontal
}

function colidiu(passaro, variosCanos) {
    let colidiu = false
    variosCanos.canos.forEach(cano => {
        if (!colidiu) {
            const superior = cano.canoCima.elemento
            const inferior = cano.canoBaixo.elemento
            colidiu = sobrepostos(passaro.elemento, superior) || sobrepostos(passaro.elemento, inferior)
        }
    });
    return colidiu
}

function GameFP() {
    let pontos = 0
    const tela = document.querySelector("#tela-jogo")
    const altura = tela.clientHeight
    const largura = tela.clientWidth
    const progresso = new Progresso()
    const passaro = new Passaro(altura)
    const CanosGame = new variosCanos(altura, largura, 300, 400, () => progresso.atualizarPontos(++pontos))
    tela.appendChild(passaro.elemento)
    tela.appendChild(progresso.elemento)
    CanosGame.canos.forEach(e => {
        tela.appendChild(e.elemento)
    });
    this.start = () => {
        const temporizador = setInterval(() => {
            CanosGame.animar()
            passaro.animar()
            if (colidiu(passaro, CanosGame)) {
                clearInterval(temporizador)
                document.querySelector('.aviso').style.display = 'block'
            }
        }, 20)
    }
}

new GameFP().start()