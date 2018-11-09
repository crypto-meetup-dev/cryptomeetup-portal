<template>
  <div :class="['country-detail', {'is-active': aboutShow}]">
    <div class="globe-control">
      <div style="position: absolute;top: 2rem;left: 5rem;">
        <button class="globe-control-item button is-hidden-mobile is-white is-small is-rounded is-outlined"
                v-show="aboutShow"
                @click="aboutShow=!aboutShow"
        >
          <b-icon icon="arrow-left" size="is-small" />&nbsp;{{$t('back')}}
        </button>
      </div>

    </div>
    <h1  v-show="aboutShow">
      <div class="content"
        v-html="$t('ABOUT_CONTENT')">
      </div>
    </h1>
  </div>
</template>
