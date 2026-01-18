import { gsap } from "gsap/gsap-core";

const filtersTable = document.querySelector('.filters-table')

const filtersBtn = document.querySelectorAll('[data-target=filters-table]')

if(filtersBtn || filtersTable){
  const tween = gsap.to(filtersTable, {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    duration: 0.4
  })
  tween.pause();
  filtersBtn.forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation()
      const isActive = document.body.classList.toggle('menu-active')

      isActive ? tween.play() : tween.reverse();
    })

  })
  filtersTable.addEventListener('click', e => {
    e.stopPropagation()
  })
  filtersTable.querySelector('.filters-table__close').addEventListener('click', e => {
    e.preventDefault()
    e.stopPropagation()
    document.body.classList.remove('menu-active')
    tween.reverse()
  })
  document.body.addEventListener('click', function(e) {
      this.classList.remove('menu-active')
      tween.reverse()
  })
}
