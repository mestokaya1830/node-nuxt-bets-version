<template>
  <div>
    <div class="not-found">{{ message }}</div>
  </div>
</template>

<script>
  export default {
    name: 'NotFound',
    props: {
      message: {
        type: String,
        required: true,
        default: ''
      } 
    }
  }
</script>
