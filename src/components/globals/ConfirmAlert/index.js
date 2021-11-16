import React, { useEffect, useRef } from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import style from './confirm-alert.module.css'

/**
 * Copyright https://github.com/GA-MO/react-confirm-alert
 * Refactored by Yusuf Al Majid <ajidalmajid6@gmail.com>
 */

function ReactConfirmAlert (props) {
    const {
        title,
        message,
        buttons = [
            {
              label: 'Cancel',
              onClick: () => null,
              className: null
            },
            {
              label: 'OK',
              onClick: () => null,
              className: null
            }
        ],
        childrenElement = () => null,
        customUI,
        closeOnClickOutside = true,
        closeOnEscape = true,
        willUnmount = () => null,
        afterClose = () => null,
        onClickOutside = () => null,
        onKeypressEscape = () => null,
        overlayClassName
    } = props

    const overlay = useRef(null)

    useEffect(() => {
        document.addEventListener('keydown', keyboardClose, false);

        return () => {
            document.removeEventListener('keydown', keyboardClose, false);
            willUnmount()
        }
    }, [])

    const handleClickButton = button => {
        if (button.onClick) button.onClick()
        close()
    }

    const handleClickOverlay = e => {
        const isClickOutside = e.target === overlay.current

        if (closeOnClickOutside && isClickOutside) {
            onClickOutside()
            close()
        }
    }

    const close = () => {
        removeBodyClass()
        removeElementReconfirm()
        removeSVGBlurReconfirm(afterClose)
    }

    const keyboardClose = event => {
        const isKeyCodeEscape = event.keyCode === 27

        if (closeOnEscape && isKeyCodeEscape) {
            onKeypressEscape(event)
            close()
        }
    }

    const renderCustomUI = () => {
        const dataCustomUI = {
            title,
            message,
            buttons,
            onClose: close
        }

        return customUI(dataCustomUI)
    }

    const btnClass = (key) => {
        switch (buttons[key].key) {
            case 'cancel':
                return `${style.react_confirm_alert_btn_cancel} ${buttons[key].className??''}`
            case 'ok':
                return `${style.react_confirm_alert_btn_ok} ${buttons[key].className??''}`
            default:
                return `${style.react_confirm_alert_btn} ${buttons[key].className??''}`
        }
    }

    return (
        <div
          className={`${style.react_confirm_alert_overlay} ${overlayClassName ? overlayClassName : ''}`}
          ref={overlay}
          onClick={handleClickOverlay}
        >
            <div className={style.react_confirm_alert}>
                {customUI ? ( renderCustomUI() ) : (
                    <div className={style.react_confirm_alert_body}>
                        {title && <h1>{title}</h1>}
                        {message}
                        {childrenElement()}
                        <div className={style.react_confirm_alert_button_group}>
                            {buttons.map((button, i) => (
                                <button key={i} onClick={() => handleClickButton(button)} className={btnClass(i)}>
                                {button.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

function createSVGBlurReconfirm () {
  // If has svg ignore to create the svg
  const svg = document.getElementById(`${style.react_confirm_alert_firm_svg}`)
  if (svg) return
  const svgNS = 'http://www.w3.org/2000/svg'
  const feGaussianBlur = document.createElementNS(svgNS, 'feGaussianBlur')
  feGaussianBlur.setAttribute('stdDeviation', '0.3')

  const filter = document.createElementNS(svgNS, 'filter')
  filter.setAttribute('id', 'gaussian-blur')
  filter.appendChild(feGaussianBlur)

  const svgElem = document.createElementNS(svgNS, 'svg')
  svgElem.setAttribute('id', `${style.react_confirm_alert_firm_svg}`)
  svgElem.setAttribute('class', `${style.react_confirm_alert_svg}`)
  svgElem.appendChild(filter)

  document.body.appendChild(svgElem)
}

function removeSVGBlurReconfirm (afterClose) {
  const svg = document.getElementById(`${style.react_confirm_alert_firm_svg}`)
  if (svg) {
    svg.parentNode.removeChild(svg)
  }
  document.body.children[0].classList.remove(`${style.react_confirm_alert_blur}`)
  afterClose()
}

function createElementReconfirm (properties) {
  let divTarget = document.getElementById(`${style.react_confirm_alert}`)
  if (divTarget) {
    // Rerender - the mounted ReactConfirmAlert
    render(<ReactConfirmAlert {...properties} />, divTarget)
  } else {
    // Mount the ReactConfirmAlert component
    document.body.children[0].classList.add(`${style.react_confirm_alert_blur}`)
    divTarget = document.createElement('div')
    divTarget.id = style.react_confirm_alert
    document.body.appendChild(divTarget)
    render(<ReactConfirmAlert {...properties} />, divTarget)
  }
}

function removeElementReconfirm () {
  const target = document.getElementById(style.react_confirm_alert)
  if (target) {
      target.classList.add(style.removing)
      // settimeout to 0.5s to remove the element
      setTimeout(() => {
        unmountComponentAtNode(target)
        target.remove()
    }, 450)
  }
}

function addBodyClass () {
  document.body.classList.add(style.react_confirm_alert_body_element)
}

function removeBodyClass () {
  document.body.classList.remove(style.react_confirm_alert_body_element)
}

export function closeAlert () {
  removeBodyClass()
  removeElementReconfirm()
  removeSVGBlurReconfirm(() => null)
}

export default function confirmAlert (properties) {
  addBodyClass()
  createSVGBlurReconfirm()
  createElementReconfirm(properties)
}