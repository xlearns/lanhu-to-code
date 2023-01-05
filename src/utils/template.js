export const data = {
  datav:{
    script:`import Full from "../components/full.vue";
    import { ref, onMounted, reactive } from "vue";
    const dom = ref();
    const state = reactive({ w: 0, h: 0 });
    function getWh() {
      let _dom = dom.value;
      [
        { l: "w", r: "clientWidth" },
        { l: "h", r: "clientHeight" },
      ].forEach(({ l, r }) => {
        state[l] = _dom[r];
      });
    }
    function init() {
      getWh();
    }
    onMounted(() => {
      init();
      window.addEventListener("resize", init);
    });`,
    template:"",
    style:`.big-view{
      height: 100%;
      width: 100%;
    }`
  },
  default:{
    script:`
    import {ref,onMounted,reactive} from 'vue'
    const state = reactive({})
    function init(){
      console.log('ok')
    }
    onMounted(()=>{
      init()
    })
    `
  },
  datavscroll:{
    style:`.big-view{
      height: 100%;
      width: 100%;
    }
    .wrap {
      height: calc(100vh - 0px);
      overflow: auto;
      box-sizing: border-box;
    }
    .wrap::-webkit-scrollbar {
      width: 8px;
    }
    .wrap::-webkit-scrollbar-thumb {
      width: 8px;
      border-radius: 4px;
      background-color: #ede7f8;
    }
    .home {
      height: 100%;
      position: relative;
    }
    `
  }
}