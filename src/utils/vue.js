import * as vueCompiler from 'vue/compiler-sfc'
import MagicString from 'magic-string'
import {data} from './template'

function _parse(obj){
  const {_template,_script,_style} = obj;
  return `<template>
  ${_template}
  </template>
  <script setup lang='ts'>
  ${_script}
  </script>
  <style scoped>${_style}</style>`

}

export function parseVue(content,type){
  let _template,_script,_style
  const sfc = vueCompiler.parse(content)
  const { script,scriptSetup,styles,template } = sfc.descriptor
  if(!scriptSetup){
    // vue2
    const script_content = script?.content ?? ''
    const template_content = template?.content ?? ''
    styles.forEach(style=>{
      const style_content = style?.content ?? ''
      _style = style_content
    })
    _template = template_content
  }


  if(type=='datav'){
    _script = data.datav.script
    _template = `<div ref='dom' class='big-view'>
    <Full :options="{ width: 1920, height: 1080, w: state.w, h: state.h }">${_template}</Full>
    </div>`
    _style = `
    ${data.datav.style}
    ${_style}`
  }else{
    _script = data.default.script;
  }
  return _parse({_template,_script,_style})
}