const gv = {
  styles: [],
  grids: []
}

// 格子纵横数量
const gridConfig = {
  wn: 6,
  hn: 6,
  pn: 1,
  nn() {
    return this.wn * this.hn
  },
  img() {
    return `./img/pintu${this.pn}.jpg`
  }
}

const mounted = function () {
  initGrids()
  shuffleGrids()
  gridClick()
}

mounted()

const destroy = function () {
  $('.wrap').html('')
  gridConfig.wn++
  gridConfig.hn++
  gridConfig.pn++
  mounted()
}

function gridStyle(n, wn, hn) {
  let gm = parseFloat($('.main').css('padding')) / 2
  let ww = parseFloat($('.wrap').css('width'))
  let wh = parseFloat($('.wrap').css('height'))
  let gw = (ww - gm * (wn - 1)) / wn
  let gh = (wh - gm * (hn - 1)) / hn
  let gl = (gw + gm) * (n % wn)
  let gt = (gh + gm) * Math.floor(n / wn)
  let style = {
    width: gw + 'px',
    height: gh + 'px',
    left: gl + 'px',
    top: gt + 'px',
    background: `url(${gridConfig.img()})`,
    backgroundSize: `${gw * wn}px ${gh * hn}px`
  }
  return { style, n, pos: `-${gw * (n % wn)}px -${gh * Math.floor(n / wn)}px` }
}

function initGrids() {
  gv.grids = []
  gv.styles = []
  for (let i = 0; i < gridConfig.nn(); i++) {
    let { style, n, pos } = gridStyle(i, gridConfig.wn, gridConfig.hn)
    let el = document.createElement('div')
    $(el).addClass('grid')
    // $(el).html(i)
    $(el).data('n', i)
    $(el).data('pos', pos)
    gv.grids.push(el)
    $('.wrap').append(el)
    gv.styles.push({ style, n })
  }
}

function initGridsStyles() {
  gv.grids.map((el, i) => {
    let { n, style } = gv.styles[i]
    $(el).data('n', n)
    $(el).css(style)
    $(el).css({ backgroundPosition: $(el).data('pos') })
  })
}

function shuffleGrids() {
  gv.styles = gv.styles.sort(() => Math.random() > 0.5 ? 1 : -1)
  initGridsStyles()
  if (success()) shuffleGrids()
}

function success() {
  let flag = true
  $('.grid').each((i, el) => {
    if ($(el).data('n') !== i) {
      flag = false
    }
  })
  return flag
}

function gridClick() {
  let a1 = null
  let a2 = null
  $('.grid').click(function () {
    a1 ? a2 = this : a1 = this
    $(this).addClass('grid-active')
    if (a1 && a2) {
      let $a1 = $(a1)
      let $a2 = $(a2)
      let n1 = $a1.data('n')
      let n2 = $a2.data('n')
      let s1 = $a1.attr('style')
      let s2 = $a2.attr('style')
      $a1.data('n', n2)
      $a2.data('n', n1)
      $a1.attr('style', s2)
      $a2.attr('style', s1)
      $a1.css({ backgroundPosition: $a1.data('pos') })
      $a2.css({ backgroundPosition: $a2.data('pos') })
      setTimeout(() => {
        $a1.removeClass('grid-active')
        $a2.removeClass('grid-active')
        a1 = null
        a2 = null
        if (success()) {
          alert('success')
          destroy()
        }
      }, 300)
    }
  })
}