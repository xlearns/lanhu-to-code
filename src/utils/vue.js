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

function transformStyle(css,config= {}){

  let _string = css;
  /*
  [
  {
    reg:/(?!height:\s*)\b\d+px\b/g,
    default:1920,
    attr:'width',
    dt:'vw'
  },
  {
    reg:/height:\s*(\d+)px\b/g,
    default:1024,
    attr:'height',
    dt:'vh'
  }
].forEach((_)=>{
  _string = _string.replace(_.reg, function(match, value) {
    if(_.attr=='height'){
      console.log(1,match,value)
      return 'height:' + parseInt(value, 10) / (config[_.attr]??_.default) * 100 + _.dt;
    }
    return parseInt(match, 10) / (config[_.attr]??_.default) * 100 + _.dt;
  });
  })
  */
  // _string = _string.replace(/(?!height:\s*)\b\d+(?:px|em|rem|vh|vw)\b/g, function(match) {
  //   return parseInt(match, 10) / (config?.width??1920) * 100 + 'vw';
  // });

if(config?.type=='filterHeight'){
  _string = _string.replace(/(?!height)\b(\w+):\s?(\d+(?:(px)?\s+\d+(px)?\s+\d+(px)?\s+\d+(px)?|(px)?\s+\d+(px)?\s+\d+(px)?\s+\d+(px)?|px\s+\d+(px)?|(px)?))/img,(match,key)=>{
    const [_k,_v]  = match.split(':')
    const value =  _v.split(' ').slice(1)
    let res = ''
    if(value.length>1){
      value.forEach(v=>{
        res += ' ' +   parseInt(v, 10) / (config?.width??1920) * 100 + 'vw'
      })
    }else{
      res =  parseInt(value[0], 10) / (config?.width??1920) * 100 + 'vw'
    }
    return _k + ":" +res
   })
} 
  return _string
}

export function parseVue(content,config={}){
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
  
  _style = transformStyle(_style,config?.style)

  
  if(config?.type=='datav-no'){
    _script = data.datav.script
    _template = `<div ref='dom' class='big-view'>
    <Full :options="{ width: 1920, height: 1080, w: state.w, h: state.h }">${_template}</Full>
    </div>`
    _style = `
    ${data.datav.style}
    ${_style}`
  }else if(config?.type=='datav-yes'){
      _script = data.datav.script
      _template = `<div class='big-view'>
        <div class="home" ref="dom">
        <Full :options="{ width: 1920, height: 540*3, w: state.w, h: state.h }">
        <!--  header  -->
        <div class="wrap">
        <!--  container  -->
          ${_template}
        </div>
        </Full>
        </div>
      </div>`
      _style = `
      ${data.datavscroll.style}
      ${_style}`
  }else{
    _script = data.default.script;
  }
  return _parse({_template,_script,_style})
}