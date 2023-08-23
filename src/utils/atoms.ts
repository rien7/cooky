import type { PrimitiveAtom } from 'jotai'
import { atom } from 'jotai'
import type { notification } from '../components/notification/model'

export const stepAtom = atom(0)
export const sentenceAtom = atom('')
export const sentenceErrorAtom = atom(get => get(sentenceAtom).length === 0 && get(stepAtom) === 0)
export const selectionAtom = atom<{ s: number; e: number }[]>([])
export const selectionErrorAtom = atom(get => get(selectionAtom).length === 0 && get(stepAtom) === 1)
export const resultAtom = atom('')
export const errorClickAtom = atom(false)
export const notificationsAtom = atom<Map<string, PrimitiveAtom<notification>>>(new Map())
export const deletedNotificationsAtom = atom<string[]>([])
