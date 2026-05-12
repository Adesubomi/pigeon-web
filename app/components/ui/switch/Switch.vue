<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { getCurrentInstance } from 'vue'
import { SwitchRoot, SwitchThumb } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<{
  checked?: boolean
  defaultChecked?: boolean
  modelValue?: boolean
  defaultValue?: boolean
  disabled?: boolean
  size?: 'sm' | 'md'
  class?: HTMLAttributes['class']
}>()

const emits = defineEmits<{
  'update:modelValue': [value: boolean]
  'update:checked': [value: boolean]
}>()

const instance = getCurrentInstance()
const rawProps = computed(() => instance?.vnode.props ?? {})
const hasRawProp = (camelName: string, kebabName = camelName) => (
  Object.prototype.hasOwnProperty.call(rawProps.value, camelName)
  || Object.prototype.hasOwnProperty.call(rawProps.value, kebabName)
)
const modelValue = computed(() => {
  if (hasRawProp('modelValue', 'model-value')) return props.modelValue
  if (hasRawProp('checked')) return props.checked
  return undefined
})
const defaultValue = computed(() => {
  if (hasRawProp('defaultValue', 'default-value')) return props.defaultValue
  if (hasRawProp('defaultChecked', 'default-checked')) return props.defaultChecked
  return undefined
})

function updateValue(value: boolean) {
  emits('update:modelValue', value)
  emits('update:checked', value)
}

const sizeClasses = computed(() => {
  if (props.size === 'md') {
    return {
      root: 'h-5 w-9',
      thumb: 'size-4 data-[state=checked]:translate-x-[1.125rem] data-[state=unchecked]:translate-x-0.5',
    }
  }

  return {
    root: 'h-4 w-7',
    thumb: 'size-3 data-[state=checked]:translate-x-3 data-[state=unchecked]:translate-x-0.5',
  }
})
</script>

<template>
  <SwitchRoot
    :model-value="modelValue"
    :default-value="defaultValue"
    :disabled="disabled"
    :class="cn('peer inline-flex shrink-0 items-center rounded-full border border-transparent shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-success-600 data-[state=unchecked]:bg-sand-300', sizeClasses.root, props.class)"
    @update:model-value="updateValue"
  >
    <SwitchThumb :class="cn('pointer-events-none block rounded-full bg-white shadow-sm ring-0 transition-transform', sizeClasses.thumb)" />
  </SwitchRoot>
</template>
