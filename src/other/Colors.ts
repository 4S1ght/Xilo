
import c from 'chalk'

function createPalette(...colors: string[]) {
    return {
        stat:       c.hex(colors[0]),
        statBG:     c.bgHex(colors[0]),
        content:    c.hex(colors[1]),
        contentBG:  c.bgHex(colors[1]),
        text:       c.hex(colors[2])
    }
}

const DARK          = "#434655"

const GREEN         = "#70CC78"
const GREEN_TXT     = "#bad8bc"
const RED           = "#dd5e5e"
const RED_TXT       = "#e9d7d7"
const BLUE          = "#6297c9"
const BLUE_TXT      = "#c6d3df"
const YELLOW        = "#dfb458"
const YELLOW_TXT    = "#d4c9b0"

export const cOK    = createPalette( GREEN, DARK, GREEN_TXT )
export const cERR   = createPalette( RED,   DARK, RED_TXT   )
export const cPASS  = createPalette( BLUE,  DARK, BLUE_TXT  )

export const green      = c.hex(GREEN)
export const greenBG    = c.bgHex(GREEN)

export const red        = c.hex(RED)
export const redBG      = c.bgHex(RED)

export const blue       = c.hex(BLUE)
export const blueBG     = c.bgHex(BLUE)

export const yellow     = c.hex(YELLOW)
export const yellowBG   = c.bgHex(YELLOW)

export const grey       = c.grey
export const greyBG     = c.bgGrey

export const underline  = c.underline