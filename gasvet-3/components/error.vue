<template>
  <div>
    <div class="error bg-r">{{ message }}</div>
  </div>
</template>

<script>
  export default {
    name: 'Error',
    props: {
      message: {
        type: Object,
        required: true,
        default: ''
      } 
    }
  }
</script>
